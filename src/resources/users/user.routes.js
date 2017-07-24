'use strict';

module.exports = function () {
	return [
		{
			route: {
				path: '/users',
				method: 'POST',
				config: {
					auth: false,
					tags: ['api', 'users'],
					description: 'Register a new user',
					validate: {},
					handler: async function (request, reply) {

					}
				}
			}
		}
	];
};
