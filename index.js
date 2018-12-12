var pull = require('pull-stream')
var ref = require('ssb-ref')

function isString(s) {
  return 'string' === typeof s
}

exports.name = 'device-address'
exports.version = require('./package.json').version
exports.manifest = {
  getAddress: 'async',
  getState: 'async',
  announce: 'async'
}

function query (id) {
  return [
    {$filter: {value: {content: {type: 'address'}}}},
    {$map: {
      id: ['value', 'author'],
      sequence: ['value', 'sequence'],
      address: ['value', 'content', 'address'],
      availability: ['value', 'content', 'availability']
    }}
//    {$sort: [['id'], ['sequence']]}
//    {$reduce: {
//      id: ['id'], sequence: {$max: true}, address: {$last: true}, availability: {$last: true}
//    }}
  ]
}
exports.init = function (sbot, config) {

  var state = {}, _ts, waiting = [], ready = false, self

  function add(peer) {
    //TODO: update scuttlebot/plugins/gossip to accept multiserver addresses
    sbot.gossip.add({key: peer.id, address: peer.address})
  }

  //build up the base state object
  pull(
    sbot.query.read({query: query(undefined), old: true, live: false, sync: false}),
    pull.drain(function (data) {
      if(data.availability == null) data.availability = 0.33
      state[data.id] = data
    }, function (err, data) {
      for(var k in state) add(state[k])
      ready = true
      while(waiting.length)
        waiting.shift()()
    })
  )

  //collect live updates to state.
  //if we had support for realtime reduce
  //queries we wouldn't need to do this
  pull(
    sbot.query.read({query: query(undefined), old:false, live: true, sync: false}),
    pull.drain(function (data) {
      if(data.availability == null) data.availability = 0.33
      state[data.id] = data
      add(data)
    })
  )

  function onReady (fn) {
    if(ready) fn()
    else waiting.push(fn)
  }
  return self = {
    getState: function (_, cb) {
      if(!cb) cb = _
      cb(null, state)
    },
    getAddress: function (id,  cb) {
      onReady(function () {
        cb(null, state[id || sbot.id])
      })
    },
    announce: function (opts, cb) {
      self.getAddress(sbot.id, function (err, data) {
        if(data) {
          if(data.address === opts.address && data.availability === opts.availability)
            return cb(null, data)
        }
        if(isString(opts.scope) && !ref.isAddress(opts.address)) {
          opts.address = sbot.getAddress(opts.scope)
        }
        if(!ref.isAddress(opts.address) || 'object' == typeof opts.address)
          return cb(new Error('not a valid address:'+opts.address))

        sbot.publish({
          type: 'address',
          recps: opts.recps,
          address: opts.address,
          availability: opts.availability
        }, cb)

      })
    }
  }
}

