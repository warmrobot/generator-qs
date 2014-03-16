module.exports = function ( grunt ) {
	require( 'load-grunt-tasks' )( grunt );

	grunt.registerTask( 'default', [ 'build' ]);
	grunt.registerTask( 'build', [ 'jade', 'cssmin:normalize', 'stylus', 'imagemin', 'copy' ]);

	grunt.initConfig({
		pkg: grunt.file.readJSON( 'package.json' ),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

		// vars
		src: 'src/',
		dest: 'build/',

		connect: {
			server: {
				options: {
					port: 9001,
					base: 'build',
					keepalive: true
				}
			}
		},

		copy: {
			all: {
				files: [{
					expand: true,
					cwd: '<%= src %>js/',
					src: '**',
					dest: '<%= dest %>js/'
				}]
			}
		},

		cssmin: {
			normalize: {
				files: {
					'<%= src %>styl/normalize.css': 'bower_components/normalize-css/normalize.css'
				}
			}
		},

		jade: {
			compile: {
				options: {
					data: {
						debug: false
					},
					pretty: true
				},
				files: [{
					expand: true,
					cwd: '<%= src %>',
					src: '*.jade',
					dest: '<%= dest %>',
					ext: '.html'
				}]
			}
		},

		imagemin: {
			all: {
				options: {
					pngquant: true
				},
				files: [{
					expand: true,
					cwd: '<%= src %>img/',
					src: ['**/*.{png,jpg,gif}'],
					dest: '<%= dest %>img/'
				}]
			}
		},

		stylus: {
			dev: {
				options: {
					compress: false,
					urlfunc: 'data-uri',
					'include css': true
				},
				files: {
					'<%= dest %>css/style.css': '<%= src %>styl/style.styl',
					'<%= dest %>css/style-ie.css': '<%= src %>styl/style-ie.styl'
				}
			}
		},
		watch: {
			jade: {
				files: ['<%= src %>**/*.jade', '<%= src %>**/*.html' ],
				tasks: [ 'jade' ]
			},
			stylus: {
				files: '<%= src %>styl/**/*.styl',
				tasks: [ 'stylus' ]
			}
		}
	});
};
