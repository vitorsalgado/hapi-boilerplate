'use strict';

const UUID = require('uuid');
const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema({
	id: { type: String, default: () => UUID.v4() },
	name: { type: String, trim: true },
	email: { type: String, lowercase: true, index: { unique: true } },
	birth: {
		dateTime: { type: Number }
	},
	genre: String,
	social: {
		facebookID: String
	},
	firebase: {
		token: String
	}
});

module.exports = Mongoose.model('users', UserSchema);
