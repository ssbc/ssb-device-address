var pull = require('pull-stream')

exports.name = 'public'
exports.version = require('./package.json').version
exports.manifest = {
  getAddress: 'async',
  announce: 'async'
}

function query (id) {
  return [
    {$filter: {value: {/*author: id, */content: {type: 'address'}}}},
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

  pull(
    sbot.query.read({query: query(undefined), old: true, live: false, sync: false}),
    pull.drain(function (data) {
      state[data.id] = data
    }, function (err, data) {
      for(var k in state) add(state[k])
      ready = true
      while(waiting.length)
        waiting.shift()()
    })
  )

  pull(
    sbot.query.read({query: query(undefined), old:false, live: true, sync: false}),
    pull.drain(function (data) {
      state[data.id] = data
      add(data)
    })
  )

  function onReady (fn) {
    if(ready) fn()
    else waiting.push(fn)
  }
  return self = {
    getAddress: function (id,  cb) {
      onReady(function () {
        cb(null, state[id || sbot.id])
      })
    },
    announce: function (options, cb) {
      self.getAddress(sbot.id, function (err, data) {
        if(data) {
          if(data.address === options.address && data.availability === options.availability)
            return cb(null, data)
        }
        sbot.publish({
          type: 'address',
          recps: options.recps,
          address: options.address,
          availability: options.availability
        }, cb)

      })
    }
  }
}

