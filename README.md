# ssb-device-address

Announce a public address for yourself. Unlike old "pub" announcements, this you 
_may not_ announce addresses for other feeds, only yourself.

## usage

Announce your address and availability. Availability is an estimate between 0 and 1
of the probability you'll be online at any given time. Availability
helps peers prioritize connecting to you, if you are unsure
set a lower value. Setting availability is mandatory.

For your pub:
```
sbot deviceAddress.announce --scope public --availability 1
```

You can also set the address manually:
```
sbot deviceAddress.announce --address <address> --availability 0.6
```

Alternatively, use a [scope](https://github.com/regular/multiserver-scopes),
and it will announce the address given by `sbot getAddress <scope>`

You can also _encrypt_ the address announcement, if you do not want 
the whole world connecting to you.

```
sbot deviceAddress.announce --scope public --availability 0.3 --recps <id>
```
Note, you can use multiple recps by just having more
`--recps <id1> --recps <id2> --recps <id3>` etc


## api

### getAddress (id, cb) => multiserver_addr

return the public address for `id`, if one has been posted.

### announce({address: addr?, availability:0-1}, cb)

Post the current address. If you pass `addr`, validate and post the value 
of `addr`. Must pass `availability` as a value between 0 and 1 inclusive. 

If callback `cb` is passed, the public address from `getAddress` will be 
passed to your callback. In case of an invalid address or availability 
value, error messages will be passed to your callback.

## License

MIT


