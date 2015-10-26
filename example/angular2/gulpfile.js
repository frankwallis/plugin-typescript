var gulp = require('gulp');

/*
	Start an http-server for the example project
*/
gulp.task('example', function(cb) {
	var hs = require("http-server");
	var open = require('open');
	var server = hs.createServer({"root": "./"});
	server.listen(8080);
	open("http://127.0.0.1:8080");
	cb();
});

/*
	Bundle the example project
*/
gulp.task('bundle', function(cb) {
	var Builder = require('systemjs-builder');
	var builder = new Builder();
	builder.reset();

	builder.loadConfig("./config.js")
		.then(function() {
			return builder.buildStatic("src", "build/build.js");
		})
		.then(function() {
			console.log('Build complete, go to http://127.0.0.1:8080/index-bundle.html');
			cb();
		})
		.catch(function(err) {
			console.log(err);
			cb(err);
		});
});

/*
	Type-check the code
*/
gulp.task('check', function(cb) {
	var Builder = require('systemjs-builder');
	var builder = new Builder();
	builder.reset();

	builder.loadConfig("config.js")
		.then(function() {
			return builder.bundle("src"); // build in-memory
		})
		.then(function() {
			cb();
		})
		.catch(function(err) {
			console.log(err);
			cb(err);
		});
});

/*
	Run a continuous type-checker ovr the example project
*/
gulp.task('flow', ['check'], function(cb) {
	gulp.watch(["./src/**/*.ts"], ['check']);
});
