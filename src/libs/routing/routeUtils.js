'use strict';

/**
 * @module RouteUtils
 * @description -
 */

/**
 * Executes the route handler according to the API Version
 * requested in accept-headers
 * @param request - Hapi request object
 * @param reply - Hapi reply interface
 * @callback reply - Hapi reply interface
 * @param handlers - Key/Value array map of Version / Handler. Eg.: 'v1', v1FuncRef, 'v2', v2FuncRef
 */
module.exports.handleByVersion = async function (request, reply, ...handlers) {
	const vIdx = handlers.indexOf(request.opts.apiVersion);
	const handler = handlers[vIdx + 1];

	await handler(request, reply);
};

/**
 * Mapped error codes documentation builder for Swagger "Implementation Notes" section
 * @param {...Object} codes - Array of error codes
 * @return {string} - HTML string of mapped errors with their respective default messages
 */
module.exports.buildNotes = function (...codes) {

	let str = 'Mapped Error Codes ( check field <strong>code</strong> on error payload )<br/>';

	codes.forEach((code) => str += `<strong>${code.code}</strong>: ${code.msg}<br/>`);

	return str;
};
