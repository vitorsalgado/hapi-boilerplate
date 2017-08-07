/* eslint-disable security/detect-non-literal-fs-filename,global-require,security/detect-non-literal-require */

'use strict';

/**
 * @module FileUtils
 */

const FileSystem = require('fs');

/**
 * Reads an directory tree recussively and syncronous
 * @param {string} dir - directory to start ready recursively
 * @param {function} predicate - predicate function to execute with each file
 * @returns {string[]} array with all files which passed on predicate
 */
const readDirRecursiveSync = (dir, predicate) => {
	let results = [];
	const directories = FileSystem.readdirSync(dir);

	directories.forEach((file) => {

		file = dir + '/' + file;

		const stat = FileSystem.statSync(file);

		if (stat && stat.isDirectory()) {
			results = results.concat(readDirRecursiveSync(file, predicate));
		} else if (predicate(file)) {
			results.push(require(file));
		}
	});

	return results;
};

module.exports.readDirRecursiveSync = readDirRecursiveSync;
