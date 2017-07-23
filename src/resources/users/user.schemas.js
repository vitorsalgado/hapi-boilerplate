'use strict';

const Joi = require('joi');

module.exports.create = Joi.object(
	{
		name: Joi.string().required(),
		email: Joi.string().email().required().lowercase(),
		birth: {
			dateTime: Joi.date().timestamp('unix')
		},
		genre: Joi.string().required(),
		facebook: {
			accessToken: Joi.string().required()
		},
		firebase: {
			token: Joi.string().required()
		}
	})
	.meta({ className: 'User' });
