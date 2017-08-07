'use strict';

module.exports = {
	apps: [
		{
			name: 'api',
			script: 'index.js',
			instances: 1,
			exec_mode: 'cluster',
			restart_delay: 10000,
			error_file: './logs/output.log',
			out_file: './logs/output.log',
			merge_logs: true
		}
	]
};
