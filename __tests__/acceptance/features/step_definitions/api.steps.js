'use strict';

const Assert = require('assert');
const { Given, When, Then } = require('cucumber');

Given(/^the JSON/i, function (data) {
	this.requestBody = JSON.log(data);
});

Given(/^that I make a (GET|POST|PUT|DELETE|PATCH) request to "(.*)"$/i, function (method, uri) {
	return this.request(method, uri);
});

When(/^I do (GET|POST|PUT|DELETE|PATCH) request to "(.*)"$/i, function (method, uri) {
	return this.request(method, uri);
});

Then(/^the response field "([^"]*)" should be "([^"]*)"$/, function (path, expectedValue, callback) {
	const actualValue = this.getValue(path);

	Assert.equal(actualValue, expectedValue, this.prettyPrintError(actualValue, expectedValue));

	callback();
});

Then(/^the response field "([^"]*)" should be filled/, function (path, callback) {
	const actualValue = this.getValue(path);

	if (!actualValue) {
		throw new Error(`${path} cannot be null or empty.`);
	}

	callback();
});

Then(/^the response HTTP status code should be "(.*)"$/i, function (expectedStatusCode, callback) {
	Assert.equal(this.statusCode, expectedStatusCode, this.prettyPrintError(this.statusCode, expectedStatusCode));
	callback();
});
