var path = require('path');
var Compiler = require('./incremental-compiler');
var Logger = require('./logger');

var logger = new Logger({debug: true});
var compiler = new Compiler();

/*
 * name: the unnormalized module name
 * parentName: the canonical module name for the requesting module
 * parentAddress: the address of the requesting module
 */
module.exports.normalize = function (name, parentName, parentAddress) {
  logger.debug('normalizing' + name);
  return Compiler.normalizePath(name);
  //return name;
}

var systemNormalize = System.normalize;

// override the normalization function
System.normalize = function(name, parentName, parentAddress) {
  var newname = fixPath(name);
  logger.debug("normalized " + name + " -> " + newname + " (" + parentName + ")");
  return systemNormalize.call(this, newname, parentName, parentAddress);
}

/*
 * load.name the canonical module name
 * load.metadata a metadata object that can be used to store
 *   derived metadata for reference in other hooks
 */
module.exports.locate = function (load) {
  logger.debug('locating ' + load.name);
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
module.exports.fetch = function (load) {
  logger.debug('fetching ' + load.name);
  return compiler.load(load.name, load.address);
}

/*
 * load.name
 * load.address
 * load.metadata
 * load.source: the fetched source
 */
module.exports.translate = function (load) {
  logger.debug('translating ' + load.name);
  var name = load.name.split('!')[0];

  var output = compiler.compile(name);
  outputDiagnostics(output.errors);

  if (output.failure) {
    throw new Error("TypeScript compilation failed " + output.errors.length );
  }
  else {
    load.source = output.js;
    load.metadata.sourceMap = output.map;
  }

  return;
}