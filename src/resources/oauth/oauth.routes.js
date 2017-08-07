'use strict';

const Schemas = require('./oauth.schemas');
const OauthService = require('./oauth.service');

module.exports = function () {
	return [
		{
			route: {
				path: '/oauth/token',
				method: 'POST',
				config: {
					tags: ['api', 'oauth'],
					auth: false,
					description: 'Authentication',
					validate: { payload: Schemas.authentication },
					payload: {
						allow: 'application/x-www-form-urlencoded'
					},
					handler: function (request, reply) {
						return OauthService.authenticate(request.payload)
							.then(reply);
					}
				}
			}
		}
	];
};
