var pkg = require('./package.json');
var fs = require('fs');
var ugly = require("uglify-js");
var jshint = require("jshint").JSHINT;

function writeBower() {
	var bower = {
		name: pkg.config.bower.name,
		description: pkg.description,
		dependencies: pkg.dependencies,
		keywords: pkg.keywords,
		authors: [pkg.author],
		license: pkg.license,
		homepage: pkg.homepage,
		ignore: pkg.config.bower.ignore,
		repository: pkg.repository,
		main: 'dest/'+pkg.config.fileName+'.js'
	};
	fs.writeFile('bower.json', JSON.stringify(bower, null, '\t'));
	return true;
}

function writeJqueryManifest() {
	var manifest = {
		name: pkg.config.jquery.name,
		version: pkg.version,
		title: pkg.config.title,
		author: pkg.author,
		licenses: pkg.config.jquery.licenses,
		dependencies: pkg.config.jquery.dependencies,
		description: pkg.description,
		keywords: pkg.keywords,
		homepage: pkg.homepage,
		demo: pkg.homepage
	};
	fs.writeFile(pkg.config.jquery.name+'.jquery.json', JSON.stringify(manifest, null, '\t'));
	return true;
}

function build(full) {
	var mini = ugly.minify(full, {fromString: true}).code;
	var header = [
		"/*!",
		"	"+pkg.config.title+" "+pkg.version,
		"	license: MIT",
		"	"+pkg.homepage,
		"*/",
		""
	].join("\n");

	fs.writeFile('dest/'+pkg.config.fileName+'.js', header+full);
	fs.writeFile('dest/'+pkg.config.fileName+'.min.js', header+mini);

	return true;
}

function lint(full) {
	jshint(full.toString(), {
		browser: true,
		undef: true,
		unused: true,
		immed: true,
		eqeqeq: true,
		eqnull: true,
		noarg: true,
		predef: ['define', 'require']
	});

	if (jshint.errors.length) {
		jshint.errors.forEach(function (err) {
			console.log(err.line+':'+err.character+' '+err.reason);
		});
	} else {
		return true;
	}
}

fs.readFile('src/'+pkg.config.fileName+'.js', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  } else {
  	lint(data) && build(data) && writeBower() && writeJqueryManifest();
  }
});