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