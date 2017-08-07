'use strict';

const Server = require('../../server').get();
const Config = require('../../config');

const Mongoose = require('mongoose');

describe('System Resources', () => {

	it('GET /health should return 200 and server information', () => {
		const options = { method: 'GET', url: '/health' };

		Mongoose.connection.readyState = 1;

		return Server.inject(options)
			.then(({ statusCode, result }) => {
				expect(statusCode).toEqual(200);
				expect(result.version).toEqual(Config.version);
				expect(result.env).toEqual(Config.environment);
				expect(result.mongodb.status).toEqual('OK');
			});
	});

	it('GET /health should return MongoDB status NOK when it is not connected', () => {
		const options = { method: 'GET', url: '/health' };

		Mongoose.connection.readyState = 0;

		return Server.inject(options)
			.then(({ statusCode, result }) => {
				expect(statusCode).toEqual(200);
				expect(result.version).toEqual(Config.version);
				expect(result.env).toEqual(Config.environment);
				expect(result.mongodb.status).toEqual('NOK');
			});
	});

	it('GET /ping should return 204', () => {
		const options = { method: 'GET', url: '/ping' };

		return Server.inject(options)
			.then(({ statusCode }) => {
				expect(statusCode).toEqual(204);
			});
	});

});
