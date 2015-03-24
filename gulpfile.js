var gulp = require('gulp');

gulp.task('test', function(cb) {
   var mocha = require('gulp-mocha');

   gulp.src('test/*-spec.js')
      .pipe(mocha({ reporter: 'nyan' }))
      .on('end', cb);
});

gulp.task('example', function(cb) {
   var hs = require("http-server");
   var open = require('open');
   var server = hs.createServer({"root": "./example"});
   server.listen(8080);
   open("http://127.0.0.1:8080"); // safari's not working :(
   cb();
});

gulp.task('bundle', function(cb) {
   var Builder = require('systemjs-builder');
   var System = global.System;

   /* So we don't have to put '!' characters in our html imports */
   /* This won't be needed once SystemJs enables registering plugins
      for extensions in the next version */
   var systemNormalize = System.normalize;
   System.normalize = function(arg1, arg2) {
      var System = this;
      return systemNormalize.call(this, arg1, arg2).then(function(normed) {
         if (normed.slice(-5) == '.html') {
            normed = normed + '!github:systemjs/plugin-text@0.0.2';
         }
         return normed;
      });
   }

   var builder = new Builder();
   builder.reset();
   builder.loadConfig("example/config.js")
      .then(function() {
         //console.log("here " + options.entryJs +  ' ' +  options.outputJs)
         return builder.buildSFX("example/index.ts!", "example/build/build.js");
      })
      .then(function() {
         console.log('Build complete');
         cb();
      })
      .catch(function(err) {
         console.log(err);
         cb(err);
      });
});
