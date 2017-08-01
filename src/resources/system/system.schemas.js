'use strict';

const Joi = require('joi');

const VALID_STATUS = ['OK', 'NOK'];

module.exports.healthCheck = Joi.object(
	{
		status: Joi.string().allow(...VALID_STATUS),
		version: Joi.string().description('Current server version'),
		env: Joi.string().description('Server environment'),
		mongodb: {
			status: Joi.string().allow(...VALID_STATUS)
		}
	});
