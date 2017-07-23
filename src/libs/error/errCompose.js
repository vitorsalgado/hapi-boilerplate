'use strict';

function Compose (error) {
	const self = this;

	self.error = error;
	self.error.data = self.error.data || {};

	this.status = function (statusCode) {
		self.statusCode = statusCode;
		return self;
	};

	this.fromCode = function (code) {
		self.code = code[0];
		self.type = code[1];
		self.message = self.error.message || code[2];

		return self;
	};

	this.code = function (code) {
		self.code = Array.isArray(code) ? code[0] : code;
		return self;
	};

	this.msg = function (msg) {
		self.message = msg;
		return self;
	};

	this.type = function (type) {
		self.type = type;
		return this;
	};

	this.asBadRequest = function () {
		self.statusCode = 400;
		throw self.error;
	};

	this.throw = function () {
		throw self.error;
	};
}

module.exports = (error) => new Compose(error);
