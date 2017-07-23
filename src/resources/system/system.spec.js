'use strict';

const Server = require('../../server').get();
const Config = require('../../config');

describe('System Resources', () => {
	it('GET /health should return 200 and server information', () => {
		const options = { method: 'GET', url: '/health' };

		return Server.inject(options)
			.then(({ statusCode, result }) => {
				expect(statusCode).toEqual(200);
				expect(result.version).toEqual(Config.version);
				expect(result.env).toEqual(Config.environment);
			});
	});
});
