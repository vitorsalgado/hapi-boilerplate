'use strict';

const HawkModel = require('./hawkModel');

const getCredentials = function (id, callback) {
	return HawkModel.findByHawkID(id)
		.then((hawk) => callback(null, { key: hawk.key, algorithm: hawk.algorithm }))
		.catch((err) => callback(err, null));
};

module.exports.getCredentials = getCredentials;
