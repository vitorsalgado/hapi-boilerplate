'use strict';

const Boom = require('boom');

function Ex () {
	const self = this;

	self.msg = function (msg) {
		self.message = msg;
		return self;
	};

	self.data = function (data) {
		self.data = data;
		return self;
	};

	self.code = function (code) {
		self.code = code;
		return self;
	};

	self.type = function (type) {
		self.type = type;
		return self;
	};

	self.unauthorized = function (schema) {
		const err = Boom.unauthorized(self.message, schema);

		err.code = self.code;
		err.type = self.type;

		return err;
	};

	self.badRequest = function () {
		const err = Boom.badRequest(self.message, self.data);

		err.code = self.code;
		err.type = self.type;

		return err;
	};
}

module.exports.ex = () => new Ex();
