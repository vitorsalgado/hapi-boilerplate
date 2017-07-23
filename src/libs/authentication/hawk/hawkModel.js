'use strict';

const Mongoose = require('mongoose');
const Boom = require('boom');

const HawkSchema = new Mongoose.Schema(
	{
		_id: { type: String, required: true, unique: true },
		key: { type: String, required: true, unique: true },
		algorithm: { type: String, required: true }
	},
	{
		collection: 'hawk',
		timestamps: true
	});

HawkSchema.statics.findByHawkID = function (hawkID) {
	return this.find({ _id: hawkID })
		.exec()
		.then((results) => {

			if (!results || results.length === 0 || results.length > 1) {
				throw Boom.unauthorized('Invalid Hawk Credentials', 'Hawk');
			}

			return results[0];
		});
};

module.exports = Mongoose.model('Hawk', HawkSchema);
