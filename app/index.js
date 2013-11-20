'use strict';
var util = require( 'util' );
var path = require( 'path' );
var yeoman = require( 'yeoman-generator' );


var QsGenerator = module.exports = function QsGenerator( args, options, config ) {
	yeoman.generators.Base.apply( this, arguments );

	this.on( 'end', function () {
		this.installDependencies( { skipInstall: options['skip-install'] } );
	} );

	this.pkg = JSON.parse( this.readFileAsString( path.join( __dirname, '../package.json' ) ) );
};

util.inherits( QsGenerator, yeoman.generators.Base );

QsGenerator.prototype.app = function app() {
	this.mkdir( 'src' );
	this.mkdir( 'build' );

	this.directory( 'jade', 'src' );
	this.copy( 'favicon.ico', 'src/favicon.ico' );

	this.copy( '_package.json', 'package.json' );
	this.copy( '_bower.json', 'bower.json' );
	this.copy( '_Gruntfile.js', 'Gruntfile.js' );
};

QsGenerator.prototype.projectfiles = function projectfiles() {
	this.copy( 'editorconfig', '.editorconfig' );
	this.copy( 'jshintrc', '.jshintrc' );
};
