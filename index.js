'use strict';

require('dotenv').config();

const Server = require('./src/server');
const MongoDB = require('./src/libs/mongoDB');

let Config = require('./src/config');
const Logger = require('./src/libs/logger');
const ConfigSchema = require('./src/config/schema');

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

Logger.debug(`
    __  __            _    ____        _ __                __      __
   / / / /___ _____  (_)  / __ )____  (_) /__  _________  / /___ _/ /____
  / /_/ / __ \`/ __ \\/ /  / __  / __ \\/ / / _ \\/ ___/ __ \\/ / __ \`/ __/ _ \\
 / __  / /_/ / /_/ / /  / /_/ / /_/ / / /  __/ /  / /_/ / / /_/ / /_/  __/
/_/ /_/\\__,_/ .___/_/  /_____/\\____/_/_/\\___/_/  / .___/_/\\__,_/\\__/\\___/
           /_/                                  /_/

`
);

Logger.debug(`Version:	${Config.version}`);
Logger.debug(`Env:		${Config.environment}`);
Logger.debug(`Server:		${Config.server.host}:${Config.server.port}`);
Logger.debug(`MongoDB:	${Config.mongoDB.useReplicaSet ? Config.mongoDB.replicaURI : Config.mongoDB.uri}`);
Logger.debug('');

Promise.all(
	[
		ConfigSchema.ensure(Config),
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
