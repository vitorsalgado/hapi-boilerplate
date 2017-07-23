'use strict';

const Config = require('../../config');
const HttpClient = require('../../libs/httpClient');
const Codes = require('../../libs/error/errCodes');
const ErrHandler = require('../../libs/error/errHandler');

const FORMAT_JSON = 'json';
const URI_ME = `${Config.facebook.graphAPIUri}/me`;

module.exports.me = (accessToken, ...fields) =>
	HttpClient.getJSON(
		{
			uri: URI_ME,
			qs: { format: FORMAT_JSON, access_token: accessToken, fields: fields }
		})
		.catch((err) =>
			ErrHandler.err(err)
				.msg(err.error.error.message)
				.code(Codes.ERR_AUTH).type(Codes.TYPE_FACEBOOK_ERR)
				.throw());
