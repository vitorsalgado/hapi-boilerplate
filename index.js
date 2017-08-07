'use strict';

require('dotenv').config();

const UUID = require('uuid');

const Server = require('./src/server');
const ServerUtils = require('./src/libs/serverUtils');
const MongoDB = require('./src/libs/mongoDB');
const Logger = require('./src/libs/logger');
const ConfigSchema = require('./src/config/schema');
const Config = require('./src/config');

const traceID = UUID.v4();

process.on('SIGTERM', ServerUtils.restInPeace(traceID));
process.on('SIGINT', ServerUtils.restInPeace(traceID));
process.on('uncaughtException', (err) => Logger.panic(err, {}, traceID));
process.on('unhandledRejection', (reason, p) => Logger.debug({ message: 'unhandledRejection', reason: reason, p: p }));

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
Logger.debug(`Server:		${Server.get().info.host}:${Server.get().info.port}`);
Logger.debug(`MongoDB:	${Config.mongoDB.useReplicaSet ? Config.mongoDB.replicaURI : Config.mongoDB.uri}`);
Logger.debug();

Promise.all(
	[
		ConfigSchema.ensure(Config),
		MongoDB.connect(),
		Server.start()
	])
	.then(() => {
		Logger.info('START', 'API is online', traceID);
	})
	.catch((err) => {
		Logger.debug('Fatal exception on startup! Server will finish ...');
		Logger.panic(err, {}, traceID);
	});
