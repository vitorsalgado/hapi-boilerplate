'use strict';

const Schemas = require('./system.schemas');

const Mongoose = require('mongoose');
const Config = require('../../config');

const MONGODB_CONNECTED_STATUS = 1;

module.exports = function () {
	return [
		{
			route: {
				path: '/health',
				method: 'GET',
				config: {
					tags: ['api', 'system'],
					auth: false,
					description: 'API health check',
					handler: function (request, reply) {
						return reply({
							status: 'OK',
							version: Config.version,
							env: Config.environment,
							mongodb: {
								status: makeStatus(() => Mongoose.connection.readyState === MONGODB_CONNECTED_STATUS)
							}
						});
					},
					response: {
						status: { 200: Schemas.healthCheck }
					}
				}
			}
		},

		{
			route: {
				path: '/ping',
				method: 'GET',
				config: {
					tags: ['api', 'system'],
					auth: false,
					description: 'API ping',
					handler: function (request, reply) {
						return reply().code(204);
					}
				}
			}
		}
	];
};

const makeStatus = (predicate) => predicate() ? 'OK' : 'NOK';
