'use strict';

const Schemas = require('./system.schemas');
const Controller = require('./system.controller');

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
					handler: Controller.healthCheck,
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
