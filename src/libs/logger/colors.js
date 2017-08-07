'use strict';

/**
 * @module Colors
 */

/**
 * Color constants
 * @readonly
 * @enum {string}
 */
module.exports = {
	/** Green (Debug) */
	debug: '\x1b[32m',

	/** Yellow (Warn) */
	warn: '\x1b[33m',

	/** Red (Error) */
	error: '\x1b[31m',

	/** Red (Fatal) */
	fatal: '\x1b[31m',

	/** Cyan (Info) */
	info: '\x1b[36m',

	/** Default color */
	default: '\x1b[0m'
};
