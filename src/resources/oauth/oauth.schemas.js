'use strict';

const Joi = require('joi');

const strFieldForPwdGrantType = Joi.string().when('grant_type', {
	is: 'password',
	then: Joi.required(),
	otherwise: Joi.optional()
});

module.exports.authentication = Joi.object(
	{
		client_id: Joi.string().required(),
		grant_type: Joi.string().allow('password', 'facebook').required(),
		state: Joi.string().required(),
		facebook_access_token: Joi.string().when('grant_type', {
			is: 'facebook',
			then: Joi.required(),
			otherwise: Joi.optional()
		}),
		username: strFieldForPwdGrantType,
		password: strFieldForPwdGrantType
	})
	.meta({ className: 'OAuth' })
	.label('OAuth');
