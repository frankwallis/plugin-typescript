var gulp = require('gulp');

gulp.task('test', function(cb) {
  var mocha = require('gulp-mocha');

  gulp.src('test/*-spec.js')
    .pipe(mocha({ reporter: 'nyan' }))
    .on('end', cb);
});

gulp.task('example', function(cb) {
  var hs = require("http-server");

  var server = hs.createServer({"root": "./example"});
  server.listen(8080);
  cb();
});
