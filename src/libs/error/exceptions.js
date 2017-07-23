'use strict';

const Boom = require('boom');
const Codes = require('./errCodes');

class BaseException extends Error {
	constructor (name, message, statusCode, code, data) {
		super();

		this.name = name;
		this.message = message;
		this.code = code;
		this.data = data;
		this.statusCode = statusCode;

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports.unauthorized = (message = 'Unauthorized', type, schema, code, data) => {
	const err = Boom.unauthorized(message, schema);

	return append(err, type, code, data);
};

module.exports.badRequest = (message = 'Bad Request', type, code = 0, data) => {
	const err = Boom.badRequest(message, data);

	return append(err, type, code, data);
};

