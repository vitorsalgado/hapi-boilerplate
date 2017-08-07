'use strict';

const RouteUtils = require('./routeUtils');
const ErrCodes = require('../error/errCodes');

describe('Route Utils', () => {
	it('should call the right handler based on version', async () => {
		const req = { opts: { apiVersion: 'v1' } };
		const reply = jest.fn();
		const v1Handler = jest.fn();
		const v2Handler = jest.fn();

		await RouteUtils.handleByVersion(req, reply, 'v1', v1Handler, 'v2', v2Handler);

		expect(v1Handler).toHaveBeenCalledWith(req, reply);
		expect(v2Handler).not.toHaveBeenCalled();
	});

	it('should build notes based on provided error codes', () => {
		const code = ErrCodes.ERR_AUTH;

		let expectedHTML = 'Mapped Error Codes ( check field <strong>code</strong> on error payload )<br/>';
		expectedHTML += `<strong>${code.code}</strong>: ${code.msg}<br/>`;

		const notes = RouteUtils.buildNotes(ErrCodes.ERR_AUTH);

		expect(notes).toEqual(expectedHTML);
	});
});
