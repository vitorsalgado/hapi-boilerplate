'use strict';

module.exports.handleByVersion = async function (request, reply, ...handlers) {
	const vIdx = handlers.indexOf(request.opts.apiVersion);
	const handler = handlers[vIdx + 1];

	await handler(request, reply);
};

module.exports.buildNotes = function (...codes) {

	let str = 'Error Codes<br/>';

	codes.forEach((code) => {

		str += `${code}<br/>`;
	});

	return str;
};
