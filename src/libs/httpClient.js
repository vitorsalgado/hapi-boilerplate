'use strict';

const Request = require('request-promise');

module.exports.getJSON = (options) =>
	exec(Object.assign({}, options, { method: 'GET', json: true, options }));

const exec = (options) => Request(options);
