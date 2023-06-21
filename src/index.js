"use strict";

/**
 * @typedef {import("moleculer").Context} Context
 */

const { Client,cacheExchange, fetchExchange } = require("@urql/core");
const fetch = require('cross-fetch');

/**
 * Service mixin allowing Moleculer services to make GraphQL requests
 *
 * @name moleculer-urql
 * @module Service
 */
module.exports = {

	/**
	 * @type {string} service name
	 */
	name: "gql",


	_client: null,

	/**
	 * Default settings
	 */
	settings: {
		gql: {
			uri: null,
			globalHeaders: null,
		}
	},

	actions: {
		query: {
			/**
			 * @param {Context} ctx
			 */
			async handler(ctx) {


        const response =  await this._client.query(ctx.params.request)

				if (response.error) {
					throw new Error('bad')
				}

        return response;
			}
		},
		mutation: {
			/**
			 * @param {Context} ctx
			 */
			async handler(ctx) {

        const response =  await this._client.mutation(ctx.params.request)
				if (response.error) {
					console.log('response: ', response.error)
					throw new Error('bad')
				}

        return response.data;
			}
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

		this._client = new Client({
      url: `${this.settings.gql.uri}`,
      exchanges: [cacheExchange, fetchExchange],
      fetch,
			fetchOptions: this.settings.gql.globalHeaders ? {
					headers: {
						...this.settings.gql.globalHeaders
					},
				} : null,
    })
	},
};