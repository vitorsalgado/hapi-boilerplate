'use strict';

const Joi = require('joi');

module.exports = Joi.object(
	{
		version: Joi.string().required(),
		environment: Joi.string().description('Runtime environment'),
		isProduction: Joi.boolean().required(),
		isTest: Joi.boolean().required().description('Check if is under test environment. NODE_ENV = test'),
		namespace: Joi.string().required().description('Used in content-type headers'),

		server: {
			port: Joi.number().required(),
			host: Joi.string().required(),
			showDocumentation: Joi.boolean().default(false).description('Show swagger and error documentations'),
			showStackErr: Joi.boolean().default(false).description('Outputs "details" field with stack trace in error responses'),
			stopTimeout: Joi.number().required().description('Server stop timeout')
		},

		mongoDB: {
			uri: Joi.string().required().uri({ scheme: ['mongodb', /mongodb:\/\/?/] }),
			useReplicaSet: Joi.boolean().required(),
			replicaName: Joi.string().when('useReplicaSet', { is: true, then: Joi.required() }),
			replicaURI: Joi.string().when('useReplicaSet', { is: true, then: Joi.required() })
		},

		redis: {
			uri: Joi.string().required().uri({ scheme: ['redis', /redis:\/\/?/] })
		},

		facebook: {
			graphAPIUri: Joi.string().required().uri()
		}
	})
	.options({ abortEarly: false });
