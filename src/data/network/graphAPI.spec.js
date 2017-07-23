'use strict';

const GraphAPI = require('./graphAPI');
const HttpClient = require('../../libs/httpClient');

describe('Graph API', () => {
	it('should', () => {
		const fbUser = { id: '1233456789', name: 'Vitor Hugo Salgado' };

		HttpClient.getJSON = jest.fn()
			.mockImplementationOnce((options) => Promise.resolve(fbUser));

		return GraphAPI.me('access_token')
			.then((fb) => {
				expect(fb).toEqual(fbUser);
			});
	});
});
