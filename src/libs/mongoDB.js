'use strict';

const Config = require('../config');
const Mongoose = require('mongoose');

Mongoose.Promise = global.Promise;

module.exports.connect = () => Mongoose.connect(Config.mongoDB.uri, getConfig());

module.exports.disconnect = () => Mongoose.disconnect();

const getConfig = () => {
	if (Config.mongoDB.useReplicaSet) {
		return {
			useMongoClient: true,
			replicaSet: Config.mongoDB.replicaURI
		};
	}

	return {
		useMongoClient: true
	};
};
