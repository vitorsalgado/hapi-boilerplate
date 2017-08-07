'use strict';

const Mongoose = require('mongoose');

const ApplicationSchema = new Mongoose.Schema({
	clientID: { type: String, unique: true, index: true },
	clientSecret: String,
	grantTypes: [String],
	name: String
});

ApplicationSchema.statics.getByIDAndGrantType = function (clientID, grantType) {
	this.findOne({ clientID: clientID, grantTypes: grantType }).exec()
		.then((app) => {
			if (!app) {
				throw new Error('application not found');
			}

			return app;
		});
};

module.exports = Mongoose.model('applications', ApplicationSchema);
