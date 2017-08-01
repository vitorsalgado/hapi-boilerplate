/* eslint-disable security/detect-child-process */

'use strict';

const Package = require('./package.json');
const Config = require('./src/config');

const UUID = require('uuid');
const UUIDv5 = require('uuid/v5');
const FileSystem = require('fs');
const RL = require('readline');
const Stream = require('stream');
const Path = require('path');
const Request = require('request-promise');
const Program = require('commander');

const exec = require('child_process').exec;
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
	.description('get changelog entry for latest version and parse to Slack Markdown format')
	.action(() => {
		const inputStream = FileSystem.createReadStream(Path.resolve('./CHANGELOG.md'));
		const readInterface = RL.createInterface(inputStream, new Stream());

		let latestChangelog = '';
		let emptySpacesFound = 0;
		let lineIndex = 0;

		readInterface.on('line', (line) => {
			let parsedLine = '';

			if (line === '') {
				emptySpacesFound++;
			}

			if (emptySpacesFound >= 2) {
				return readInterface.close();
			}

			if (lineIndex === 2) {
				const version = line.substring(line.lastIndexOf(' ') + 1, line.length);

				if (version !== Package.version) {
					throw new Error(`Version ${Package.version} does not have an entry in CHANGELOG.md yet!`);
				}
			}

			if (lineIndex === 0 || lineIndex === 2) {
				parsedLine = `*${line.replace('## ', '').replace('# ', '')}*\n`;
			} else if (lineIndex >= 3 && line !== '') {
				parsedLine = `${line.replace('*', '•')}\n`;
			} else {
				parsedLine = `${line}\n`;
			}

			latestChangelog += parsedLine;
			lineIndex++;
		});

		readInterface.on('close', () => console.log(latestChangelog));
	});

Program
	.command('slack-notify-success [title] [webhook] [version]')
	.description('sends a message to Slack notifiying the success')
	.action((title, webhook, version) =>
		exec('node cli changelog', (err, data) => err
			? console.log(err)
			: Request(
				{
					uri: webhook,
					method: 'POST',
					body: {
						text: title,
						mrkdwn: true,
						attachments: [
							{
								pretext: `>*Commit*: ${process.env.TRAVIS_COMMIT_MESSAGE}\n>*Triggered by*: ${process.env.TRAVIS_EVENT_TYPE}`,
								color: 'good',
								title: `Build: ${process.env.TRAVIS_BUILD_NUMBER} | By: ${process.env.USER} | Branch: ${process.env.TRAVIS_BRANCH}`,
								title_link: `https://travis-ci.org/vitorsalgado/hapi-boilerplate/builds/${process.env.TRAVIS_BUILD_ID}`,
								mrkdwn_in: ['text', 'pretext'],
								text: data.toString()
							},
							{
								color: '#4285F4',
								title: 'Heroku Application',
								title_link: 'https://hapi-boilerplate.herokuapp.com/docs'
							}
						]
					},
					json: true
				})
				.catch(console.error))
	);

Program
	.command('slack-notify-error [title] [webhook]')
	.description('sends a message to Slack notifying the error')
	.action((title, webhook, version) =>
		Request(
			{
				uri: webhook,
				method: 'POST',
				body: {
					text: title,
					mrkdwn: true,
					attachments: [
						{
							color: 'danger',
							text: `*Commit*: ${process.env.TRAVIS_COMMIT_MESSAGE}\nSomething went wrong during the last deployment!.\nNavigate with the link for more details.`,
							title: `Build: ${process.env.TRAVIS_BUILD_NUMBER} | By: ${process.env.USER} | Branch: ${process.env.TRAVIS_BRANCH}`,
							title_link: `https://travis-ci.org/vitorsalgado/hapi-boilerplate/builds/${process.env.TRAVIS_BUILD_ID}`,
							mrkdwn_in: ['text', 'pretext']
						},
						{
							color: 'warning',
							title: `Test Result: ${process.env.TRAVIS_TEST_RESULT}`
						}
					]
				},
				json: true
			})
			.catch(console.error));

Program.parse(argv);
