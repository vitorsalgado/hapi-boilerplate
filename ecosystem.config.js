'use strict';

const Config = require('./src/config');

module.exports = {
	apps: [

		{
			name: 'hapi-boilerplate',
			script: 'index.js',
			instances: 0,
			exec_mode: 'cluster',
			restart_delay: 10000,
			error_file: Config.isProduction ? './logs/error.log' : '/dev/null',
			out_file: Config.isProduction ? './logs/output.log' : '/dev/null',
			merge_logs: true
		}
	]
};
