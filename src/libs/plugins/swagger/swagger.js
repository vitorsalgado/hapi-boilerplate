'use strict';

const Config = require('../../../config/index');
const HapiSwaggered = require('hapi-swaggered');

module.exports = {
	register: HapiSwaggered,
	options: {
		tags: [
			{
				name: 'api',
				description: 'API Endpoints'
			},
			{
				name: 'system',
				description: 'System utilities'
			},
			{
				name: 'oauth',
				description: 'Authentication / Authorization'
			}
		],
		tagging: {
			mode: 'tags'
		},
		info: {
			title: 'Hapi Boilerplate Documentation',
			version: Config.version,
			description: `Hapi boilerplate application and library with initial configurations ready.`
		}
	}
};
