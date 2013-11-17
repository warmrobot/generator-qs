module.exports = function ( grunt ) {
	require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

	grunt.registerTask( 'default', [ 'build' ]);
	grunt.registerTask( 'build', [ 'jade', 'stylus', 'imagemin', 'copy' ]);

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
					'<%= dest %>css/main.css': '<%= src %>styl/main.styl',
					'<%= dest %>css/main-ie.css': '<%= src %>styl/main-ie.styl'
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
