var Builder = require('jspm').Builder
var builder = new Builder()

builder.buildStatic('src', 'build/build.js', { rollup: true, sourceMaps: true, globalName: 'calculator' })
   .then(function() {
      console.log('Build complete, go to http://127.0.0.1:8080/index-bundle.html')
   })
   .catch(function(err) {
      console.log(err)
   })
