'use strict';

module.exports.parse = (data) => {
	try {
		return JSON.stringify(data, 2, 2);
	} catch (e) {
		return data;
	}
};
