# ssb-device-address

announce a public address for yourself.
unlike old "pub" announcements,
this you _may not_ announce addresses for other feeds, only yourself.

## usage

announce your address and availability. availability is an estimate between 0 and 1
of the probability you'll be online at any given time. Availability
helps peers prioritize connecting to you, if you are unsure
set a lower value. Setting availability is mandatory.

```
sbot deviceAddress.announce --addess <address> --availability 0.6
```
easier, is just to use a [scope](https://github.com/regular/multiserver-scopes),
and it will announce the address given
by `sbot getAddress <scope>`

```
sbot deviceAddress.announce --scope <scope> --availability 0.3
```
you can also publish a private address, if you don't want the entire scuttleverse
connecting to you.

```
sbot deviceAddress.announce --scope public --availability 0.3 --recps <id>
```
note, you can use multiple recps by just having more
`--recps <id1> --recps <id2> --recps <id3>` etc


## api

### getAddress (id, cb) => multiserver_addr

return the public address for `id`, if one has been posted.

### announce({address: addr?, availability:0-1}, cb) => post the current address, or addr if given

## License

MIT

