/* eslint-disable global-require */

'use strict';

const { build, buildHttpErr } = require('./logBuilder');
const Levels = require('./levels');

describe('Logger', () => {
	it('should create log with additions, simple message and a new correlation ID', () => {
		const log = build(Levels.WARN, 'msg', { test: 'test' });

		expect(log.correlationId).toBeDefined();
		expect(log.test).toEqual('test');
		expect(log.message).toEqual('msg');
		expect(log.level).toEqual(Levels.WARN);
	});

	it('should create log with error information', () => {
		const err = new TestError('the message', 'dt');
		const log = build(Levels.INFO, err, { test: 'test' });

		expect(log.correlationId).toBeDefined();
		expect(log.test).toEqual('test');
		expect(log.message).toEqual('the message');
		expect(log.stack).toEqual(err.stack);
		expect(log.type).toEqual(err.constructor.name);
		expect(log.level).toEqual(Levels.INFO);
		expect(log.extra).toEqual('dt');
	});

	it('should not generate and ID when one is provided', () => {
		const log = build(Levels.FATAL, 'msg', 'add', 'ID');

		expect(log.correlationId).toEqual('ID');
		expect(log.message).toEqual('msg');
		expect(log.level).toEqual(Levels.FATAL);
	});

	it('should assign additions array to opts in log', () => {
		const arr = [{ data: 'data' }];
		const log = build(Levels.DEBUG, 'msg', arr, 'ID');

		expect(log.correlationId).toEqual('ID');
		expect(log.message).toEqual('msg');
		expect(log.opts).toEqual(arr);
		expect(log.level).toEqual(Levels.DEBUG);
	});

	it('should assign data array to log', () => {
		const arr = [{ data: 'data' }];
		const log = build(Levels.DEBUG, arr, null, 'ID');

		expect(log.correlationId).toEqual('ID');
		expect(log.data).toEqual(arr);
		expect(log.level).toEqual(Levels.DEBUG);
	});

	class TestError extends Error {
		constructor (message, extra) {
			super(message);
			this.extra = extra;
		}
	}
});
