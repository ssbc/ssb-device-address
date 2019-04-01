
module.exports = {
  description: 'advertise an publically reachable address for an ssb device',
  commands: {
    getAddress: {
      description: 'get the announced address for a given peer, if known',
      args: {
        id: {
          type: 'FeedId', description: 'an ssb feed identity',
          optional: false
        }
      }
    },
    announce: {
      description: 'announce an address for your device',
      args: {
        availability: {
          type: 'number',
          description: 'availability as decimal between 0 and 1. estimate of probability a peer can connect, defaults to 0.3',
          optional: true
        },
        scope: {
          type: 'string',
          description: 'the address scope to announce, normally this would be "public"',
          optional: true
        },
        recps: {
          type: "Array<FeedId>",
          description: 'feeds this address announcement should be encrypted to',
          optional: true
        },
        address: {
          type: "MultiServerAddress",
          description: 'a multiserver address, either "scope" or "address" must be set',
          optional: true
        }
      }
    }
  }

}



