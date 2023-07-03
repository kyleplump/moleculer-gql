# moleculer-gql

A wrapper of the [URQL](https://formidable.com/open-source/urql/) client, providing a GraphQL integration for the [Moleculer Framework](https://moleculer.services/)

## Features
- Queries
- Mutations
- Custom Headers
- Opt-in [Graphcache](https://formidable.com/open-source/urql/docs/graphcache/) support

## Install
```
npm i moleculer-gql moleculer-web
```

## Settings
`moleculer-gql` offers the following service settings:
```
 settings: {
      gql: {
          uri: '',
          globalHeaders: {
          },
          enableGraphcache: false,
      }
    }
```

## Usage
Call either the `query` or `mutation` action.  An example of the `query` action:
```
const { ServiceBroker } = require("moleculer");
const GQLService = require('../src/index')

// Create a ServiceBroker
const broker = new ServiceBroker();

// Define a service
broker.createService({
    name: "gql",
    mixins: [GQLService],
    settings: {
      gql: {
          uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index'
      }
    }
});

const request = `
  query Query {
    allFilms {
      films {
        title
        director
        releaseDate
        speciesConnection {
          species {
            name
            classification
            homeworld {
              name
            }
          }
        }
      }
    }
  }
`;


// Start the broker
broker.start()
  // Call the service
  .then(() => broker.call("gql.query", { request }))
  // Print the response
  .then(res => console.log("Result: ", res))
  .catch(err => console.error(`Error occured! ${err.message}`));
```

# License
The project is available under the [MIT license](https://tldrlegal.com/license/mit-license).