'use strict';

const Config = require('./');
const ConfigSchema = require('./schema');

describe('Config', () => {
	it('should crash when config is invalid according to schema', () => {
		expect(() => ConfigSchema.ensure(Config)).toThrow();
	});
});
