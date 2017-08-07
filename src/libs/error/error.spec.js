'use strict';

const ErrCodes = require('./errCodes');
const ErrHandler = require('./errHandler');

describe('Error', () => {
	it('should return the correctly message for code', () => {
		const msg = ErrCodes.getMsg(ErrCodes.ERR_AUTH.code);

		expect(msg).toEqual('Could not authenticate you');
	});

	it('should build new handled error with original error data', () => {
		const data = { data: 'extra' };
		const testErr = new TestError('the message', data);

		const ex = ErrHandler
			.err(testErr)
			.transformAndReturn();

		expect(ex).toBeInstanceOf(Error);
		expect(ex.isBoom).toBeTruthy();
		expect(ex.isHandled).toBeTruthy();
		expect(ex.output.statusCode).toEqual(500);
		expect(ex.output.payload.type).toEqual(testErr.constructor.name);
		expect(ex.output.payload.message).toEqual('the message');
		expect(ex.data.extra).toEqual(data);
	});

	it('should build bad request error with correctly type', () => {
		const data = { data: 'extra' };
		const testErr = new TestError('the message', data);

		const ex = ErrHandler
			.err(testErr)
			.badRequestFromCode(ErrCodes.ERR_AUTH, ErrCodes.TYPE_FACEBOOK_ERR)
			.msg('my msg')
			.transformAndReturn();

		expect(ex).toBeInstanceOf(Error);
		expect(ex.isBoom).toBeTruthy();
		expect(ex.isHandled).toBeTruthy();
		expect(ex.output.statusCode).toEqual(400);
		expect(ex.output.payload.type).toEqual(ErrCodes.TYPE_FACEBOOK_ERR);
		expect(ex.output.payload.message).toEqual('my msg');
		expect(ex.data.extra).toEqual(data);
	});

	class TestError extends Error {
		constructor (name, extra) {
			super(name);
			this.extra = extra;
		}
	}
});
