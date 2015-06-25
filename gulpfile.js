var gulp = require('gulp');

gulp.task('test', function(cb) {
   var mocha = require('gulp-mocha');

   gulp.src('test/*-spec.js')
      .pipe(mocha({ reporter: 'nyan' }))
      .on('end', cb);
});

/*
   Start an http-server for the example project
*/
gulp.task('example', function(cb) {
   var hs = require("http-server");
   var open = require('open');
   var server = hs.createServer({"root": "./example"});
   server.listen(8080);
   open("http://127.0.0.1:8080"); // safari's not working :(
   cb();
});

/*
   Bundle the example project
*/
gulp.task('bundle', function(cb) {
   var Builder = require('systemjs-builder');
   var builder = new Builder();
   builder.reset();

   builder.loadConfig("example/config.js")
      .then(function() {
         builder.config({
            baseURL: "./example"
         })
         return builder.buildSFX("app", "example/build/build.js");
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
   Run a continuous type-checker ovr the example project
*/
gulp.task('flow', function(cb) {
   var Builder = require('systemjs-builder');
   var builder = new Builder();
   builder.reset();

   builder.loadConfig("example/config.js")
      .then(function() {
         builder.config({
            baseURL: "./example"
         })
         return builder.buildSFX("app", "example/build/build.js");
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
