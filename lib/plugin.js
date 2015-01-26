var path = require("path");
var Compiler = require('./compiler');
var EntryCompiler = require('./entry-compiler');
var Logger = require('./logger');

var options = {};

var logger = new Logger(options);
var compiler = new Compiler(options);
var entryCompiler = new EntryCompiler(logger, compiler, options);

/*
 * name: the unnormalized module name
 * parentName: the canonical module name for the requesting module
 * parentAddress: the address of the requesting module
 */
module.exports.normalize = function (name, parentName, parentAddress) {
  console.log('normalizing' + name);
  return name;
}


var systemNormalize = System.normalize;
// override the normalization function
System.normalize = function(name, parentName, parentAddress) {
  var newname = fixPath(name);
  console.log("normalized " + name + " -> " + newname + " (" + parentName + ")");
 return systemNormalize.call(this, newname, parentName, parentAddress);
}

/*
 * load.name the canonical module name
 * load.metadata a metadata object that can be used to store
 *   derived metadata for reference in other hooks
 */
module.exports.locate = function (load) {
  console.log('locating ' + load.name);
  return this.baseURL + fixPath(load.name);// + '.js';
}

function fixPath(pathname) {
    var isRelative = './' == pathname.slice(0, 2);
    var isParent = '..' == pathname.slice(0, 2);
    var isAbsolute = '/' == pathname[0];

    if (isRelative || isParent || isAbsolute) {
      var filename = path.basename(pathname);
      
      if (filename.indexOf(".") < 0)
        return pathname + '.ts!';
     // else if (path.extname(filename) == '.js')
       // return pathname.substr(0, pathname.length -3);
      else if (path.extname(filename) == '.html')
        //return pathname + '!';
        return pathname + '.tx!html'; // this is probably bad.
      //return pathname.substr(0, pathname.length -5) + '.htmlabc!html'; // this is probably bad.
    }

    return pathname;
}


/*
 * load.name: the canonical module name
 * load.address: the URL returned from locate
 * load.metadata: the same metadata object by reference, which
 *   can be modified
 */
// module.exports.fetch = function (load) {
//   console.log('fetching ' + load.name);
//   // return new Promise(function(resolve, reject) {
//   //   myFetchMethod.get(load.address, resolve, reject);
//   // });
// }

/*
 * load.name
 * load.address
 * load.metadata
 * load.source: the fetched source
 */
module.exports.translate = function (load) {
  console.log('translating1 ' + load.name);

  var name = load.name.split('!')[0];

  var result = compiler.compileSource(name, load.source)
  outputPath = Compiler.tsToJs(name);
  load.source = result.output[outputPath];

  console.log(outputPath);
  console.log(load.source);
  return; 
  //return load.source;
}

/*
 * load identical to previous hooks, but load.source
 * is now the translated source
 */
// module.exports.instantiate = function (load) {
//   console.log('instantiating ' + load.name);
//   // an empty return indicates standard ES6 linking and execution
//   return;

//   // a return value creates a "dynamic" module linking
//   return {
//     deps: ['some', 'dependencies'],
//     execute: function() {
//       return loader.newModule({
//         some: 'export'
//       });
//     }
//   };
// }
