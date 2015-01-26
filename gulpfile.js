var gulp = require('gulp');
var gutil = require("gulp-util");
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var hub = require('gulp-hub');

gulp.task('test', function(cb) {
    gulp.src('lib/**/*.js')
        .pipe(istanbul())                   // instrument the files
        .on('finish', function () {
            gulp.src('test/*-spec.js')
                .pipe(mocha({reporter: 'nyan'}))
                .pipe(istanbul.writeReports())      // write coverage reports
                .on('end', cb)
        });
});

hub('./example/gulpfile.js');
