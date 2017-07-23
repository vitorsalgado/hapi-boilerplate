'use strict';

const ApplicationModel = require('./application.model');
const UserModel = require('../users/user.model');
const GraphAPI = require('../../data/network/graphAPI');
const ErrCodes = require('../../libs/error/errCodes');

const ERR_OAUTH = 'OAuthError';

module.exports.authenticate = async function (credentials) {
	const { client_id, client_secret, grant_type, facebook_access_token } = credentials;

	return ApplicationModel
		.findOne({ clientID: client_id, clientSecret: client_secret, grantTypes: grant_type }).exec()
		.then((app) => {
			// if (!app) {
			// 	return Promise.reject(ex().type(ERR_OAUTH).unauthorized());
			// }

			return GraphAPI.me(facebook_access_token);
		})
		.then((fbUser) => UserModel.find({ social: { facebookID: fbUser.id } }).exec())
		.then((user) => {
			if (!user || user.length === 0) {
				return Promise.reject(ex().unauthorized('', ERR_OAUTH, ErrCodes.ERR_UNABLE_TO_AUTH));
			}

			return user;
		});
};
