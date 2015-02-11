var gulp = require('gulp');

gulp.task('test', function(cb) {
  var mocha = require('gulp-mocha');

  gulp.src('test/*-spec.js')
    .pipe(mocha({ reporter: 'nyan' }))
    .on('end', cb);
});

gulp.task('example', function(cb) {
  var fs = require('fs');
  var ls = require('live-server');

  fs.symlink("./", "./example/plugin", function(err) {
      if (err && (err.code != "EEXIST")) throw err;
      ls.start('8080', './example');
      cb();
  });
});
