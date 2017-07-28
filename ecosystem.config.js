'use strict';

const Config = require('./src/config');

module.exports = {
	apps: [
		{
			name: 'hapi-boilerplate',
			script: 'index.js',
			instances: 1,
			exec_mode: 'cluster',
			restart_delay: 10000,
			error_file: './logs/error.log',
			out_file: './logs/output.log',
			merge_logs: true
		}
	]
};
