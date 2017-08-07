'use strict';

const Package = require('../../package.json');

module.exports = {
	version: Package.version,
	environment: process.env.NODE_ENV || 'not_set',
	namespace: 'br.com.hapiboilerplate',

	isProduction: process.env.NODE_ENV === 'production',
	isTest: process.env.NODE_ENV === 'test',

	server: {
		port: process.env.PORT,
		showDocumentation: process.env.SHOW_DOCS === 'true',
		showStackErr: process.env.SHOW_STACK === 'true',
		stopTimeout: 10 * 1000
	},

	mongoDB: {
		uri: process.env.MONGODB_URI,
		useReplicaSet: process.env.MONGODB_USE_REPLICA === 'true',
		replicaName: process.env.MONGODB_REPLICA_NAME,
		replicaURI: process.env.MONGODB_REPLICA_URI
	},

	redis: {
		uri: process.env.REDIS_URL
	},

	facebook: {
		graphAPIUri: 'https://graph.facebook.com/v2.10'
	}
};
