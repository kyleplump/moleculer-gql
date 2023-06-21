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
            uri: 'http://localhost:4000',
        }
    }
});

const request = `
query GetBooks {
  books {
    title
    author
  }
}
        `;

const mut = `
mutation AddBook {
    addBook(name: "test book title", author: "mr. author" ) {
        title
    }
  }`

// Start the broker
broker.start()
    // Call the service
    .then(() => broker.call("gql.query", { request }))
    // Print the response
    .then(res => console.log("got back from mixin: ", res))
    .catch(err => console.error(`Error occured! ${err.message}`));