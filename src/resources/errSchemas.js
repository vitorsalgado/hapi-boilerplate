'use strict';

const Joi = require('joi');

const defaultError = Joi.object(
	{
		trace_id: Joi.string().allow('', null).description('Backend Log identifier.'),
		message: Joi.string().allow('', null).description('Error message.'),
		dev: Joi.any().optional().description('Stack Trace. Available only in development environments.'),
		code: Joi.number().description('Numeric code associated with the error.')
	});

const internalServerError = {
	description: 'Internal Server Error',
	schema: defaultError.meta({ className: 'Internal Server Error' })
};

const badRequest = {
	description: 'Bad Request',
	schema: Joi.object(
		{
			trace_id: Joi.string().allow('', null).description('Backend Log identifier.'),
			message: Joi.string().allow('', null).description('Error message.'),
			dev: Joi.any().optional().description('Stack Trace. Available only in development environments.'),
			code: Joi.number().optional().description('Numeric code associated with the error.'),
			errors: Joi.array().items(Joi.object(
				{
					field: Joi.string(),
					message: Joi.string().allow('', null)
				}))
				.optional()
				.meta({ className: 'Client Validation Issues' })
		})
		.meta({ className: 'Bad Request' })
};

const unauthorized = {
	description: 'Unauthorized',
	schema: defaultError.meta({ className: 'Unauthorized' })
};

const notFound = {
	description: 'Not Found',
	schema: defaultError.label('Not Found').meta({ className: 'Not Found' })
};

module.exports = {
	internalServerError,
	badRequest,
	unauthorized,
	notFound
};
