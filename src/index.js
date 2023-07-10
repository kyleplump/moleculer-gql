"use strict";

/**
 * @typedef {import("moleculer").Context} Context
 */

const { Client, cacheExchange, fetchExchange } = require("@urql/core");
const { cacheExchange: graphcache } = require('@urql/exchange-graphcache');
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
			enableGraphcache: false,
			graphcacheSettings: {
				resolvers: null
			}
		}
	},

	actions: {
		query: {
			/**
			 * @param {Context} ctx
			 * @returns {(Object|Error)} result or error
			 */
			async handler(ctx) {

				if(!ctx.params.request) throw new Error('"request" not present.')

        const response =  await this._client.query(ctx.params.request);

				if (response.error) {
					throw new Error(response.error)
				}

        return response.data;
			}
		},
		mutation: {
			/**
			 * @param {Context} ctx
			 * @returns {(Object|Error)} result or error
			 */
			async handler(ctx) {

				if(!ctx.params.request) throw new Error('"request" not present.')

        const response =  await this._client.mutation(ctx.params.request);

				if (response.error) {
					throw new Error(response.error)
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
      exchanges: [this.settings.gql.enableGraphcache ? graphcache({ resolvers: this.settings.gql.graphcache.resolvers ? { ...this.settings.graphcacheSettings.resolvers } : null }) : cacheExchange, fetchExchange],
      fetch,
			fetchOptions: this.settings.gql.globalHeaders ? {
					headers: {
						...this.settings.gql.globalHeaders
					},
				} : null,
    })
	},
};