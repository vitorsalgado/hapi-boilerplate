'use strict';

module.exports.parseJoiErrors = (data) =>
	data.details.map((detail) => {
		return {
			field: detail.context.key,
			message: detail.message
		};
	});

module.exports.buildDevErr = (response) => {
	const isErr = response.data instanceof Error;
	const stack = [response.stack];

	if (isErr) {
		stack.push(response.data);
	}

	return stack;
};

module.exports.removeUnusedFields = (response) => {
	response.output.payload.validation = undefined;
	response.output.payload.attributes = undefined;
	response.output.payload.statusCode = undefined;
	response.output.payload.error = undefined;
};
