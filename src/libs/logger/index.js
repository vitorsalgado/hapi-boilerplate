'use strict';

const Config = require('../../config');
const Levels = require('./levels');
const Colors = require('./colors');
const LogBuilder = require('./logBuilder');

let debugFunc = () => { /* the default for production environments is to do nothing */ };
let parser = (data) => JSON.stringify(data);
let stdOutFunc = (data) => console.log(parser(data));

let stdErrFunc = (data) => console.error(parser(data));

if (!Config.isProduction) {
	debugFunc = (data) => console.log(data || '');
	parser = (data, level) => `${JSON.stringify(data, 4, 4)}`;
	stdOutFunc = (data) => console.log(`${Colors[data.level]}${parser(data)}${Colors.default}`);
	stdErrFunc = (data) => console.error(`${Colors[data.level]}${parser(data)}${Colors.default}`);
}

module.exports.debug = debugFunc;

module.exports.info = (event, data, traceId) => logToStdOut(LogBuilder.build(Levels.INFO, data, { event: event }, traceId));

module.exports.warn = (err, opts, traceId) => logToStdErr(LogBuilder.build(Levels.WARN, err, opts, traceId));

module.exports.error = (err, opts, traceId) => logToStdErr(LogBuilder.build(Levels.ERROR, err, opts, traceId));

module.exports.panic = (err, opts, traceId) => {
	logToStdErr(LogBuilder.build(Levels.FATAL, err, opts, traceId));
	process.nextTick(() => process.exit(1));
};

module.exports.httpErr = (request, response, traceId) => logToStdErr(LogBuilder.buildHttpErr(request, response, traceId));

const logToStdOut = (data) => Config.isTest || stdOutFunc(data);

const logToStdErr = (data) => Config.isTest || stdErrFunc(data);
