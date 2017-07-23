'use strict';

const GraphAPI = require('./graphAPI');
const HttpClient = require('../../libs/httpClient');

describe('Graph API', () => {
	it('should', () => {
		HttpClient.getJSON = jest.fn()
			.mockImplementationOnce((options) => Promise.resolve({}));

		return GraphAPI.me('access_token')
			.then((fb) => {
				expect(fb).not.toBeNull();
			});
	});
});