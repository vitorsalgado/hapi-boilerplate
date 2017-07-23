'use strict';

const ErrMap = new Map();

const TYPE_OAUTH_ERR = 'OAuthException';
const TYPE_FACEBOOK_ERR = 'FacebookException';

const codes = {
	ERR_AUTH: [11, TYPE_OAUTH_ERR, 'Could not authenticate you']
};

Object.keys(codes)
	.map((key) => codes[key])
	.forEach((code) => ErrMap.set(code[0], code.splice(1)));

module.exports = {
	ErrMap,

	ERR_AUTH: codes.ERR_AUTH,

	TYPE_OAUTH_ERR,
	TYPE_FACEBOOK_ERR
};
