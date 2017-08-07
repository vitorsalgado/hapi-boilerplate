'use strict';

const GraphAPI = require('./graphAPI');
const HttpClient = require('../../libs/httpClient');

const OauthErr = require('./__fixtures__/oauthErr.json');

describe('Graph API', () => {
	it('should return facebook user', async () => {
		const fbUser = { id: '1233456789', name: 'Vitor Hugo Salgado' };

		HttpClient.getJSON = jest.fn()
			.mockImplementationOnce((options) => Promise.resolve(fbUser));

		const fb = await GraphAPI.me('access_token');

		expect(fb).toEqual(fbUser);
	});

	it('should return a handled exception with facebook message when an oauth exception occurs', () => {
		HttpClient.getJSON = jest.fn()
			.mockImplementationOnce(() => Promise.reject(OauthErr));

		return GraphAPI.me('invalid_access_token')
			.catch((err) => {
				expect(err).toBeInstanceOf(Error);
				expect(err.isHandled).toBeTruthy();
				expect(err.output.payload.message).toEqual(OauthErr.error.error.message);
			});
	});

	it('should return a handled exception', () => {
		HttpClient.getJSON = jest.fn()
			.mockImplementationOnce(() => Promise.reject(new Error('the message')));

		return GraphAPI.me('invalid_access_token')
			.catch((err) => {
				expect(err).toBeInstanceOf(Error);
				expect(err.isHandled).toBeTruthy();
				expect(err.output.payload.message).toEqual('Could not authenticate you');
			});
	});
});
