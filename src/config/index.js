'use strict';

const Package = require('../../package.json');

let confs = {
	version: Package.version,
	environment: process.env.NODE_ENV,
	namespace: 'br.com.hapiboilerplate',

	isProduction: process.env.NODE_ENV === 'production',
	isTest: process.env.NODE_ENV === 'test',

	server: {
		port: process.env.HB_PORT,
		host: process.env.HB_HOST,
		showDocumentation: process.env.HB_SHOW_DOCS === 'true',
		showStackErr: process.env.HB_SHOW_STACK === 'true',
		stopTimeout: 10 * 1000
	},

	mongoDB: {
		uri: process.env.HB_MONGODB_URI,
		useReplicaSet: process.env.HB_MONGODB_USE_REPLICA === 'true',
		replicaName: process.env.HB_MONGODB_REPLICA_NAME,
		replicaURI: process.env.HB_MONGODB_REPLICA_URI
	},

	redis: {
		uri: process.env.HB_REDIS_URI
	},

	facebook: {
		graphAPIUri: 'https://graph.facebook.com/v2.10'
	}
};

module.exports = confs;
