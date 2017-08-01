'use strict';

const Mongoose = require('mongoose');
const Config = require('../../config');

const MONGODB_CONNECTED_STATUS = 1;

module.exports.healthCheck = function (request, reply) {

	return reply({
		status: 'OK',
		version: Config.version,
		env: Config.environment,
		mongodb: {
			status: makeStatus(() => Mongoose.connection.readyState === MONGODB_CONNECTED_STATUS)
		}
	});
};

const makeStatus = (predicate) => predicate() ? 'OK' : 'NOK';
