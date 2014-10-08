'use strict';

var extend = require('util')._extend;
var yeoman = require('yeoman-generator');
var GruntfileEditor = require('gruntfile-editor');


module.exports = yeoman.generators.Base.extend({
	constructor: function (args, options) {
		yeoman.generators.Base.apply(this, arguments);

		this.currentYear = (new Date()).getFullYear();

		// Можно не выбирать из списка, а передавать как --сssFormat=stylus
		this.option('cssFormat', {
			desc: 'Выберите `sass` или `stylus`.',
			type: String,
			defaults: false
		});

		// --cssExt = [sass || styl]
		this.option('cssExt', {
			desc: 'Выберите расширение исходных файлов для CSS `sass`, `scss` или `styl`.',
			type: String,
			defaults: false
		});
	},

	prompting: function (argument) {
		// Уже передали в явном виде через опции?
		if (this.option.cssFormat) {
			if (!this.options.cssExt) {
				this.cssExt = this.cssFormat === 'sass' ? 'sass' : 'styl';
			}
			return;
		}

		var done = this.async();

		this.prompt({
			'type': 'list',
			'name': 'cssFormat',
			'message': 'Выберите исходный формат для CSS:',
			'choices': ['sass', 'stylus']
		}, function (props) {
			this.cssFormat = props.cssFormat;

			if (this.cssFormat === 'sass') {
				this.prompt({
					'type': 'list',
					'name': 'cssExt',
					'message': 'Выберите расширение для SASS',
					'choices': ['sass', 'scss']
				}, function (props) {
					this.cssExt = props.cssExt;

					done();
				}.bind(this))
			} else {
				this.cssExt = 'styl';

				done();
			}
		}.bind(this));
	},

	writing: function () {
		this.mkdir('src');
		this.mkdir('build');

		// HTML
		this.directory('jade', 'src');

		// CSS
		this.mkdir('build/css');
		this.mkdir('src/' + this.cssExt);
		this.directory(this.cssExt, 'src/' + this.cssExt);

		// JS
		this.mkdir('src/js');
		this.mkdir('build/js');
		this.mkdir('build/js/vendor');
		this.directory('js', 'src/js');

		// IMG
		this.mkdir('src/img');
		this.mkdir('build/img');

		// MISC
		this.copy('favicon.ico', 'src/favicon.ico');
		this.copy('bower.json', 'bower.json');
		this.copy('gitignore', '.gitignore');

		// PACKAGE.JSON
		var pkg = this.src.readJSON('package.json');
		delete pkg.devDependencies[this.cssFormat === 'sass' ? 'grunt-contrib-stylus' : 'grunt-sass'];
		this.write('package.json', JSON.stringify(pkg, null, '\t'));

		// GRUNT
		var gruntFileContent = new GruntfileEditor(this.src.read('Gruntfile.js'));
		this.env.gruntfile = gruntFileContent;
		this.gruntfile.registerTask('build', ['jade', 'cssmin:normalize', this.cssFormat, 'imagemin', 'copy']);
		this.gruntfile.insertConfig('cssExt', '\'' + this.cssExt + '\'');

		var cssTask = {
			dev: {
				options: {
					compress: false
				},

				files: {
					'<%= dest %>css/style.css': '<%= src %><%= cssExt %>/style.<%= cssExt %>'
				}
			}
		};

		if (this.cssFormat === 'stylus') {
			extend(cssTask.dev.options, {
				urlfunc: 'data-uri',
				'include css': true
			});
		}

		this.gruntfile.insertConfig(this.cssFormat, JSON.stringify(cssTask));
	},

	install: function () {
		this.on('end', function () {
			if (!this.options['skip-install']) {
				this.installDependencies({
					skipMessage: this.options['skip-install-message'],
					skipInstall: this.options['skip-install']
				});
			}
		});
	}
});