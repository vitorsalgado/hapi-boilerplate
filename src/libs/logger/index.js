'use strict';

const Config = require('../../config');
const Parser = require('./parser');

const UUID = require('uuid');
const Moment = require('moment');

const colors = {
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	red: '\x1b[31m',
	cyan: '\x1b[36m',
	blue: '\x1b[34m',
	default: '\x1b[0m'
};

let debugFunc = () => {};

if (!Config.isProduction) {
	debugFunc = (data) => console.log(`${colors.green}${data}${colors.default}`);
}

module.exports.debug = debugFunc;

module.exports.info = (data) => console.log(`${colors.cyan}${Parser.log(data)}${colors.default}`);

module.exports.error =
	module.exports.warn =
		(data) => {
			const log = defs(data);

			console.error(`${colors.red}${Parser.parse(log)}${colors.default}`);

			return log.traceID;
		};

module.exports.buildHttpErr = (request, response) => {
	const { uri: { href } = {} } = request;
	const { auth: { isAuthenticated } = {} } = request;

	return {
		traceID: UUID.v4(),
		request: {
			url: href,
			headers: request.headers,
			method: request.method,
			payload: request.payload || undefined,
			isAuthenticated: isAuthenticated,
			correlationID: request.defs.correlationID
		},
		response: {
			statusCode: response.statusCode,
			code: response.output.payload.code,
			message: response.message,
			error: response.output.payload.error
		},
		stack: response.stack
	};
};

const defs = (data) => {
	let d = Object.assign({}, data);

	if (data instanceof Error) {
		d.stack = data;
	}

	d.traceID = UUID.v4();
	d.createdAt = Moment().format('YYYY-MM-DD HH:mm:ss');

	d.server = {
		version: Config.version,
		env: Config.environment,
		pid: process.pid
	};

	return d;
};
