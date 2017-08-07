'use strict';

const UUID = require('uuid');
const Levels = require('./levels');
const Config = require('../../config');

module.exports.build = (level, data, additions, id) => {
	const logEntry = {
		correlationId: id || UUID.v4(),
		level: level,
		createdAt: data.createdAt || new Date(),
		server: {
			version: Config.version,
			pid: process.pid,
			env: Config.environment
		}
	};

	if (Array.isArray(additions)) {
		logEntry.opts = additions;
	} else if (typeof additions === 'object') {
		Object.assign(logEntry, additions);
	}

	if (typeof data === 'string') {
		logEntry.message = data;
	} else if (data instanceof Error) {
		logEntry.stack = data.stack;
		logEntry.message = data.message;
		logEntry.type = data.constructor.name;

		Object.assign(logEntry, data);
	} else if (Array.isArray(data)) {
		logEntry.data = data;
	} else if (typeof data === 'object') {
		Object.assign(logEntry, data);
	}

	return logEntry;
};

module.exports.buildHttpErr = (request, response, traceId) => {
	const { url: { href } = {} } = request;
	const { auth: { isAuthenticated } = {} } = request;

	const level = response.isJoi ? Levels.WARN : Levels.ERROR;

	const httpErr = {
		request: {
			url: href,
			headers: request.headers,
			method: request.method,
			payload: request.payload || undefined,
			isAuthenticated: isAuthenticated
		},
		response: {
			statusCode: response.statusCode || response.output.statusCode,
			code: response.output.payload.code,
			type: response.type || response.output.payload.error,
			message: response.message
		}
	};

	return exports.build(level, response, httpErr, traceId);
};
