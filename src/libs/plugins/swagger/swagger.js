'use strict';

const Config = require('../../../config/index');
const HapiSwaggered = require('hapi-swaggered');

module.exports = {
	register: HapiSwaggered,
	options: {
		tags: [
			{ name: 'api' },
			{
				name: 'system',
				description: 'System Utilities'
			},
			{
				name: 'oauth',
				description: 'OAuth'
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
