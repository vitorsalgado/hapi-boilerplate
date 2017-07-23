'use strict';

const Path = require('path');

require('dotenv').config({ src: Path.resolve('./.env') });

const Server = require('../../src/server');
const Supertest = require('supertest');

describe('Health', () => {
	beforeAll(() => Server.start());

	afterAll(() => Server.stop());

	it('should return ok', () => {
		return Supertest(Server.get().listener).get('/health')
			.expect(({ body }) => {
				console.log(body);
			});
	});
});
