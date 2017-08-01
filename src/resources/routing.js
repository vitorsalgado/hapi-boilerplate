'use strict';

const Joi = require('joi');
const Path = require('path');
const FileUtils = require('../libs/fileUtils');
const ErrorSchemas = require('./errSchemas');
const ErrCodes = require('../libs/error/errCodes');

const { handleByVersion } = require('../libs/routeUtils');

const ROUTES_PATH = Path.join(__dirname);

module.exports.setUpRoutes = () =>
	FileUtils.readDirRecursiveSync(ROUTES_PATH, (file) => file.indexOf('.routes.js') > -1)
		.map((module) => module.bind({ handleByVersion })())
		.reduce((a, b) => a.concat(b))
		.map((routeSpec) => routeSpec.route)
		.map(setDefaults)
		.map(setErrSchemas);

const setDefaults = (route) => {
	if (route.config.security === undefined) {
		route.config.security = true;
	}

	if (route.bind) {
		Object.assign(route.config.bind, ErrCodes);
	} else {
		route.config.bind = { ErrCodes };
	}

	if (!route.config.validate) {
		return route;
	}

	if (!route.config.validate.options) {
		route.config.validate.options = { abortEarly: false };
	}

	return route;
};

const setErrSchemas = (route) => {
	const strHapiSwaggeredPlugin = 'hapi-swaggered';

	if (!route.config.plugins) {
		route.config.plugins = {};
		route.config.plugins[strHapiSwaggeredPlugin] = { responses: {} };
	}

	const is400AlreadyDefined = route.config.plugins[strHapiSwaggeredPlugin].responses['400'];
	const hasAnyRequestValidation = route.config.validate && (route.config.validate.payload || route.config.validate.params || route.config.validate.query);
	const hasHeaders = route.config.validate && route.config.validate.headers;

	if (!is400AlreadyDefined && hasAnyRequestValidation) {
		route.config.plugins[strHapiSwaggeredPlugin].responses['400'] = ErrorSchemas.badRequest;
	}

	if (hasAnyRequestValidation && route.method === 'GET') {
		route.config.plugins[strHapiSwaggeredPlugin].responses['404'] = ErrorSchemas.notFound;
	}

	if (hasHeaders && route.config.validate.headers.isJoi) {
		if (Joi.reach(route.config.validate.headers, 'authorization')) {
			route.config.plugins[strHapiSwaggeredPlugin].responses['401'] = ErrorSchemas.unauthorized;
		}
	}

	if (!route.config.plugins[strHapiSwaggeredPlugin].responses['500']) {
		route.config.plugins[strHapiSwaggeredPlugin].responses['500'] = ErrorSchemas.internalServerError;
	}

	return route;
};
