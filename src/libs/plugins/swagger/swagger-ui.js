'use strict';

const HapiSwaggeredUI = require('hapi-swaggered-ui');

module.exports = {
	register: HapiSwaggeredUI,
	options: {
		title: 'Hapi Boilerplate Documentation',
		path: '/docs',
		swaggerOptions: {
			validatorUrl: null
		}
	}
};
