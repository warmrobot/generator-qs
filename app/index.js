'use strict';
var util = require( 'util' );
var path = require( 'path' );
var yeoman = require( 'yeoman-generator' );


var QsGenerator = module.exports = function QsGenerator( args, options, config ) {
	yeoman.generators.Base.apply( this, arguments );

	this.on( 'end', function () {
		this.installDependencies({
			skipInstall: options[ 'skip-install' ],
			callback: function() {
				console.log ( arguments );
				this.emit( 'depsInstalled' );
			}.bind( this )
		});
	});

	this.on( 'depsInstalled', function() {
		this.spawnCommand( 'grunt', [ 'build' ]);
	});

	this.pkg = JSON.parse( this.readFileAsString( path.join( __dirname, '../package.json' ) ) );
};

util.inherits( QsGenerator, yeoman.generators.Base );

QsGenerator.prototype.app = function app() {
	this.mkdir( 'src' );
	this.mkdir( 'build' );

	this.mkdir( 'src/js' );
	this.mkdir( 'build/js' );

	this.mkdir( 'src/styl' );
	this.mkdir( 'build/css' );

	this.mkdir( 'src/img' );
	this.mkdir( 'build/img' );

	this.directory( 'jade', 'src' );
	this.directory( 'styl', 'src/styl' );
	this.directory( 'js', 'src/js' );

	this.copy( 'favicon.ico', 'src/favicon.ico' );

	this.copy( '_package.json', 'package.json' );
	this.copy( '_bower.json', 'bower.json' );
	this.copy( '_Gruntfile.js', 'Gruntfile.js' );
};

QsGenerator.prototype.projectfiles = function projectfiles() {
	this.copy( 'editorconfig', '.editorconfig' );
	this.copy( 'jshintrc', '.jshintrc' );
};
