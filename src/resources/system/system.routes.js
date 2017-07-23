'use strict';

const Joi = require('joi');
const Config = require('../../config');

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
							env: Config.environment
						});
					},
					response: {
						status: {
							200: Joi.object({
								status: Joi.string(),
								version: Joi.string(),
								env: Joi.string()
							})
						}
					}
				}
			}
		}
	];
};
