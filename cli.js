'use strict';

const Package = require('./package.json');
const Config = require('./src/config');

const UUID = require('uuid');
const UUIDv5 = require('uuid/v5');
const FileSystem = require('fs');
const Readline = require('readline');
const Stream = require('stream');
const Path = require('path');
const Request = require('request-promise');
const Program = require('commander');

const argv = process.argv;

if (argv.length <= 2) {
	argv.push('--help');
}

Program
	.version(Package.version)
	.description('Utilities CLI Tool for development and Ci/Cd workflow');

Program
	.command('version')
	.description('get package version')
	.action(() => console.log(Package.version));

Program
	.command('uuid')
	.description('generates a valid UUID v5')
	.action(() => console.log(UUIDv5(Config.namespace, UUID.v4())));

Program
	.command('changelog')
	.description('get changelog entry for latest version')
	.action(() => {
		const inputStream = FileSystem.createReadStream(Path.resolve('./CHANGELOG.md'));
		const readInterface = Readline.createInterface(inputStream, new Stream());

		let latestChangelog = '';
		let emptySpacesFound = 0;
		let lineIndex = 0;

		readInterface.on('line', (line) => {
			if (line === '') {
				emptySpacesFound++;
			}

			if (emptySpacesFound >= 2) {
				readInterface.close();
			}

			if (lineIndex === 2) {
				const version = line.substring(line.lastIndexOf(' ') + 1, line.length);

				if (version !== Package.version) {
					throw new Error(`Version ${Package.version} does not have an entry in CHANGELOG.md yet!`);
				}
			}

			latestChangelog += `${line}\n`;
			lineIndex++;
		});

		readInterface.on('close', () => console.log(latestChangelog));
	});

Program
	.command('slack-notify-success')
	.description('')
	.option('--webhook [webhook]', 'Slack WebHook')
	.action(() =>
		Request(
			{
				uri: Program.webhook,
				method: 'POST',
				body: {}
			})
			.then()
	);

Program.parse(argv);
