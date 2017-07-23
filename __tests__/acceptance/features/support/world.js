'use strict';

const _ = require('lodash');
const Request = require('request-promise');
const Cucumber = require('cucumber');

const defineSupportCode = Cucumber.defineSupportCode;

function World({ attach, parameters }) {
	this.attach = attach;
	this.parameters = parameters;

	const self = this;

	this.request = function (method, uri) {
		return _httpRequest({ method: method, uri: uri });
	};

	this.httpGet = function (uri) {
		return _httpRequest({ method: 'GET', uri: uri });
	};

	this.httpDelete = function (uri) {
		return _httpRequest({ method: 'DELETE', uri: uri });
	};

	this.httpPost = function (uri) {
		return _httpRequest({ method: 'POST', uri: uri });
	};

	this.httpPut = function (uri) {
		return _httpRequest({ method: 'PUT', uri: uri });
	};

	this.getValue = function (path) {
		return _.get(self.actualResponse, path);
	};

	this.prettyPrintJSON = function (json) {
		return JSON.stringify(json, null, '  ');
	};

	this.prettyPrintError = function (actualValue, expectedValue) {
		return `\r\nExpected: ${expectedValue}\r\nActual: ${actualValue}\r\nRequest Body:\r\n${self.prettyPrintJSON(self.requestBody)}\r\nResponse Status Code: ${self.statusCode}\r\nResponse Body:\r\n${self.prettyPrintJSON(self.actualResponse)}`;
	};

	const _httpRequest = function (options) {
		if (self.baseUrl) {
			options.uri = self.baseUrl + options.uri;
		}

		return Request({
			method: options.method,
			uri: options.uri,
			body: self.requestBody,
			json: true,
			resolveWithFullResponse: true
		}).then((response) => {

			if (process.env.DEBUG) {
				console.log(response);
			}

			self.actualResponse = response.body;
			self.statusCode = response.statusCode;
			self.headers = response.headers;
		});
	};
}

defineSupportCode(function ({ setWorldConstructor }) {
	setWorldConstructor(World);
});
