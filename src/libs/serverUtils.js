'use strict';

const Server = require('../server');
const Logger = require('../libs/logger');
const MongoDB = require('../libs/mongoDB');
const Config = require('../config');

module.exports.parseJoiErrors = (data) =>
	data.details.map((detail) => {
		return {
			field: detail.context.key,
			message: detail.message
		};
	});

module.exports.buildDevErr = (response) => {
	const isErr = response.data instanceof Error;
	const stack = [response.stack];

	if (isErr) {
		stack.push(response.data);
	}

	return stack;
};

module.exports.restInPeace = (traceID) => () => {
	Server.get().root.stop({ timeout: Config.server.stopTimeout }, (err) =>
		MongoDB.disconnect()
			.then(() => {
				if (err) {
					Logger.error(err, null, traceID);
					process.exit(1);
				}

				Logger.info('STOP', 'API stopped', traceID);
				process.exit();
			})
			.catch((err) => {
				Logger.error(err, null, traceID);
				process.exit(1);
			}));
};

module.exports.removeUnusedFields = (response) => {
	response.output.payload.validation = undefined;
	response.output.payload.attributes = undefined;
	response.output.payload.statusCode = undefined;
	response.output.payload.error = undefined;
};
