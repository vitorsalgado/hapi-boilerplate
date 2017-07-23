'use strict';

const Assert = require('assert');
const Cucumber = require('cucumber');
const Server = require('../../../../src/server');
const Config = require('../../config/index');

const { Before, BeforeAll, After, AfterAll } = Cucumber;

BeforeAll(() => Server.start());

AfterAll(() => Server.stop());

Before('@baseUrl', function (scenarioResult) {

	const scenario = scenarioResult.scenario;
	const tags = scenario.tags;

	for (let i = 0; i < tags.length; i++) {
		const name = tags[i].name;

		if (name.includes('baseUrl-')) {
			const value = name.split('-')[1];

			this.baseUrl = Config.baseUrl[value];

			return;
		}
	}
});

After('@json', function (scenarioResult) {
	if (scenarioResult.statusCode === 201) {
		return;
	}

	const contentType = this.headers['content-type'];

	Assert.ok(/application\/json/.test(contentType), 'Content-Type should be application/json');
});
