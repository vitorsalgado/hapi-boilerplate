'use strict';

const Config = require('../config');
const Mongoose = require('mongoose');

Mongoose.Promise = global.Promise;

module.exports.connect = () => Mongoose.connect(Config.mongoDB.uri, getConfig());

module.exports.disconnect = () => !Mongoose.connection || Mongoose.connection.close();

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
