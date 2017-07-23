/* eslint-disable security/detect-non-literal-regexp */

'use strict';

const { Server } = require('hapi');
const UUID = require('uuid');
const CatboxRedis = require('catbox-redis');

const Config = require('./config');
const ServerUtils = require('./libs/serverUtils');
const Plugins = require('./libs/plugins');
const Router = require('./resources/routing');
const Logger = require('./libs/logger');
const HawkAuthStrategy = require('./libs/authentication/hawk/hawkStrategy');

const acceptHeaderRegex = new RegExp(`^application/vnd.${Config.namespace}.(v[a-z0-9\\-.]+)\\+(json|xml){0,100}`, 'i');

const server = new Server({
	connections: { compression: false },
	cache: [{ name: 'redisCache', engine: CatboxRedis, host: Config.redis.uri, partition: 'cache' }]
});

server.connection({ host: Config.server.host, port: Config.server.port, labels: ['api'] });
server.register(Plugins.load());
server.auth.strategy('hawk', 'hawk', { getCredentialsFunc: HawkAuthStrategy.getCredentials });

Router.setUpRoutes()
	.forEach((route) => server.route(route));

server.ext('onRequest', function (request, reply) {
	const accept = request.headers['accept'];
	const acceptParts = acceptHeaderRegex.exec(accept) || [];

	const defs = {};

	defs.channel = request.headers['x-channel'] || '';
	defs.correlationID = request.headers['x-correlation-id'] || UUID.v4();
	defs.apiVersion = acceptParts[1] || '';
	defs.contentType = acceptParts[2] || 'json';
	defs.start = Date.now();

	request.defs = defs;

	reply.continue();
});

server.ext('onPreResponse', function (request, reply) {
	const { correlationID, start } = request.defs;
	const { statusCode, response } = request;

	const apiVersionHeader = 'x-api-version';
	const correlationIDHeader = 'x-correlation-id';
	const responseTimeHeader = 'x-response-time';

	if (statusCode < 400 || !response.isBoom) {
		response.headers[correlationIDHeader] = correlationID;
		response.headers[apiVersionHeader] = Config.version;
		response.headers[responseTimeHeader] = `${Math.ceil(Date.now() - start)}ms`;

		return reply.continue();
	}

	const traceID = Logger.error(Logger.buildHttpErr(request, response));

	const { isJoi = false } = response.data || {};
	const { code = 0 } = response;

	response.output.statusCode = response.statusCode || response.output.statusCode;
	response.output.payload.message = response.message;
	response.output.payload.code = code;
	response.output.payload.type = response.type || response.output.payload.error;
	response.output.payload.trace_id = traceID;

	if (isJoi) {
		response.output.payload.errors = ServerUtils.parseJoiErrors(response.data);
		response.output.payload.message = 'Invalid parameters. Check "errors" field for more details.';
	}

	if (Config.server.showStackErr) {
		response.output.payload.stack = ServerUtils.buildDevErr(response);
	}

	ServerUtils.removeUnusedFields(response);

	response.output.headers[correlationIDHeader] = correlationID;
	response.output.headers[apiVersionHeader] = Config.version;
	response.output.headers[responseTimeHeader] = `${Math.ceil(Date.now() - start)}ms`;

	return reply.continue();
});

module.exports.start = () => new Promise((resolve, reject) => server.start((err) => err ? reject(err) : resolve(server)));

module.exports.stop = () => server.stop();

module.exports.get = () => server;
