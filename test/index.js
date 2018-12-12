
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
  var addr = alice.getAddress('local') || alice.getAddress('device')
  console.log('addr', addr)
  t.ok(addr, 'alice has an address, at least local or device')
  //although, we would not advertise a device address in practice.

  alice.deviceAddress.getAddress(alice.id, function (err, data) {
    t.notOk(err, 'not an error')
    t.notOk(data, 'expected no address so far') //nothing has been set yet
    alice.deviceAddress.announce({
      address: addr,
      availability: 0.8
    }, function (err, msg) {
      if(err) throw err
      console.log('published', msg)
      setTimeout(function (){
        alice.deviceAddress.getAddress(alice.id, function (err, data) {
          t.notOk(err)
          t.ok(data)
          t.equal(data.address, addr)
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


