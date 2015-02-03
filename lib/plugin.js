import path from 'path';
import Compiler from './incremental-compiler';
import Logger from './logger';
import formatErrors from './format-errors';

var logger = new Logger({debug: true});
var compiler = new Compiler(_fetch, _resolve);

/*
 * name: the unnormalized module name
 * parentName: the canonical module name for the requesting module
 * parentAddress: the address of the requesting module
 */
export function normalize(name, parentName, parentAddress) {
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
export function locate(load) {
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


function _fetch(name) {
  var load = {
    name: name,
    metadata: {}
  }
  return System.locate(load).then(function(address) {
    logger.debug("located " + address);
    load.address = address;
    return System.fetch(load).then(function(res) {
      logger.debug("loaded " + name);
      return res;
    });
  });
}

function _resolve(parent, dep) {
  logger.debug("resolving " + parent + " -> " + dep);
  var result = "";

  if (dep[0] == '/')
    result = dep;
  else if (dep[0] == '.')
    result = path.join(path.dirname(parent), dep);
  else
    result = dep;

  if (path.extname(result) != '.ts')
    result = result + ".ts";

  logger.debug('resolved ' + result)
  return result;
}

/*
 * load.name: the canonical module name
 * load.address: the URL returned from locate
 * load.metadata: the same metadata object by reference, which
 *   can be modified
 */
export function fetch(load) {
  logger.debug('fetching ' + load.name);
  var name = load.name.split('!')[0];
  return compiler.load(name, load.address);
}

/*
 * load.name
 * load.address
 * load.metadata
 * load.source: the fetched source
 */
export function translate (load) {
  logger.debug('translating ' + load.name);
  var name = load.name.split('!')[0];

  var output = compiler.compile(name);
  formatErrors(output.errors);

  if (output.failure) {
    throw new Error("TypeScript compilation failed " + output.errors.length );
  }
  else {
    load.source = output.js;
    load.metadata.sourceMap = output.map;
  }

  return;
}