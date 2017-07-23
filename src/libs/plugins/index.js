'use strict';

const Inert = require('inert');
const Vision = require('vision');
const Good = require('./good');
const Swagger = require('./swagger/swagger');
const SwaggerUI = require('./swagger/swagger-ui');
const HapiAuthHawk = require('hapi-auth-hawk');

const Config = require('../../config');

module.exports.load = () => {
	const plugins = [HapiAuthHawk];

	if (Config.server.showDocumentation) {
		plugins.push(Inert, Vision, Swagger, SwaggerUI);
	}

	if (!Config.isProduction && !Config.isTest) {
		plugins.push(Good);
	}

	return plugins;
};
