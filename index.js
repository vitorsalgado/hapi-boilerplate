'use strict';

require('dotenv').config();

const FileSystem = require('fs');
const Path = require('path');
const Server = require('./src/server');
const MongoDB = require('./src/libs/mongoDB');

let Config = require('./src/config');
const Logger = require('./src/libs/logger');
const ConfigValidator = require('./src/config/schema');

const restInPeace = () =>
	Server.get().root.stop({ timeout: Config.server.stopTimeout }, (err) =>
		MongoDB.disconnect()
			.then(() => {
				if (err) {
					Logger.error(err);
				}

				process.exit(err ? 1 : 0);
			})
			.catch((err) => {
				Logger.error(err);
				process.exit(1);
			}));

process.on('SIGTERM', restInPeace);
process.on('SIGINT', restInPeace);

const banner = FileSystem.readFileSync(Path.join(__dirname, './banner.txt'));

Logger.debug(banner.toString());

Logger.debug(`Version:	${Config.version}`);
Logger.debug(`Env:		${Config.environment}`);
Logger.debug(`Server:		${Config.server.host}:${Config.server.port}`);
Logger.debug(`MongoDB:	${Config.mongoDB.useReplicaSet ? Config.mongoDB.replicaURI : Config.mongoDB.uri}`);
Logger.debug('');

Promise.all(
	[
		ConfigValidator.validate(Config),
		MongoDB.connect(),
		Server.start()
	])
	.then(() => {
		Logger.debug('API is online and waiting for requests ...\n');
	})
	.catch((err) => {
		Logger.debug('Fatal exception on startup! Server will finish ...');
		Logger.error(err);

		process.removeListener(restInPeace);
		process.exit(-1);
	});
