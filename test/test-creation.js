/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;


describe('qs generator', function () {
	beforeEach(function (done) {
		helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
			if (err) {
				return done(err);
			}

			this.app = helpers.createGenerator('qs:app', [
				'../../app'
			]);
			done();
		}.bind(this));
	});

	it('creates expected files', function (done) {
		var expected = [
			// add files you expect to exist here.
			'.gitignore',
//			'.editorconfig'
		];

		helpers.mockPrompt(this.app, {
			'cssFormat': 'stylus'
		});
		this.app.options.cssFormat = 'stylus';
		this.app.run({}, function () {
			helpers.assertFile(expected);
			done();
		});
	});
});
