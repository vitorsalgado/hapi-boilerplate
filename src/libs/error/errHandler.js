'use strict';

/**
 * General application error handler
 * It exposes a builder and returns the final wrapped by Boom
 * @module ErrorHandler
 */

const _ = require('lodash');
const Boom = require('boom');

/**
 * Error Builder
 * @param {Error|Object} error - Error instance or data object to initialize the builder
 * @constructor
 */
function Err (error) {
	const self = this;

	self.error = {};
	self.origininal = error;

	if (error instanceof Err) {
		self.error = Boom.boomify(error);
	} else {
		self.error = Boom.create(500, 'Internal Server Error', error);
	}

	self.type = error.constructor.name;
	self.statusCode = self.error.output.statusCode || 500;
	self.code = 0;
	self.error.isHandled = true;
	self.message = error.message || self.error.message;

	this.withStatus = function (statusCode) {
		self.statusCode = statusCode;

		return self;
	};

	this.fromCode = function (code, type) {
		self.code = code.code;
		self.type = type || self.type;
		self.message = code.msg || self.error.message;

		return self;
	};

	this.withCode = function (code, type) {
		self.code = code;
		self.type = type || self.type;

		return self;
	};

	this.msg = function (msg) {
		self.message = msg;

		return self;
	};

	this.msgFromPath = function (path) {
		self.message = _.get(self.origininal, path, self.message);

		return self;
	};

	this.withType = function (type) {
		self.type = type;

		return this;
	};

	this.asBadRequest = function () {
		self.statusCode = 400;

		return this;
	};

	this.badRequestFromCode = function (code, type, msg) {
		this.fromCode(code, type, msg);
		this.asBadRequest();

		return this;
	};

	this.transformAndReturn = function () {
		transform();

		return self.error;
	};

	this.throw = function () {
		transform();

		throw self.error;
	};

	function transform () {
		self.error.message = self.message || self.error.message;
		self.error.output.statusCode = self.statusCode;
		self.error.output.payload.statusCode = self.statusCode;
		self.error.output.payload.code = self.code;
		self.error.output.payload.type = self.type;
		self.error.output.payload.message = self.message || self.error.message;
	}
}

/**
 * Error Builder
 * @param error {Error|Object} - Error instance or data object
 */
module.exports.err = (error) => new Err(error);
