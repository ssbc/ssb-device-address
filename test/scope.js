
var tape = require('tape')
var Scuttlebot = require('scuttlebot')
  .use(require('scuttlebot/plugins/gossip'))
  .use(require('ssb-query'))
  .use(require('../'))
var ssbKeys = require('ssb-keys')

var alice = Scuttlebot({
  temp:'test-block-alice', timeout: 1400,
  keys:ssbKeys.generate(),
})


tape('getAddress', function (t) {
  alice.deviceAddress.getAddress(alice.id, function (err, data) {
    t.notOk(err)
    t.notOk(data) //nothing has been set yet
    t.end()
  })
})

tape('announce', function (t) {
  console.log('addr', alice.getAddress())
  t.ok(alice.getAddress('public'))
  alice.deviceAddress.getAddress(alice.id, function (err, data) {
    t.notOk(err)
    t.notOk(data) //nothing has been set yet
    alice.deviceAddress.announce({
      scope: 'public',
      availability: 0.8
    }, function (err, msg) {
      if(err) throw err
      console.log('published', msg)
      setTimeout(function (){
        alice.deviceAddress.getAddress(alice.id, function (err, data) {
          t.notOk(err)
          t.ok(data)
          t.equal(data.address, alice.getAddress())
          t.equal(data.availability, 0.8)
          t.end()
        })
      },1000)
    })
  })
})


tape('shutdown', function (t) {
  alice.close()
  t.end()
})


