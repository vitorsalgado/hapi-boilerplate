'use strict';

/**
 * @module ErrorCodes
 * @description Contains all error codes, types and their respective default messages used in the application
 */

const ErrMap = new Map();

/**
 * Error types enum
 * @readonly
 * @enum {string}
 */
const types = {
	TYPE_OAUTH_ERR: 'OAuthException',
	TYPE_FACEBOOK_ERR: 'FacebookException'
};

const makeCode = (code, msg) => { return { code: code, msg }; };

/**
 * Error Codes enum
 * @readonly
 * @enum {Object}
 */
const codes = {
	ERR_AUTH: makeCode(11, 'Could not authenticate you')
};

Object.keys(codes)
	.map((key) => codes[key])
	.forEach((code) => ErrMap.set(code.code, code));

/**
 * Get error message by code.
 * @example - code 11 will return "Could not authenticate you"
 * @param {number} code
 */
const getMsg = (code) => ErrMap.has(code) ? ErrMap.get(code).msg : '';

module.exports = {
	ErrMap,

	ERR_AUTH: codes.ERR_AUTH,

	TYPE_OAUTH_ERR: types.TYPE_OAUTH_ERR,
	TYPE_FACEBOOK_ERR: types.TYPE_FACEBOOK_ERR,

	getMsg
};
