import path from 'path';
import ts from 'typescript';
import {IncrementalCompiler} from './incremental-compiler';
import formatErrors from './format-errors';
import {fixRequires} from './fix-requires';
import {isRelative, isAbsolute} from './utils';
import Logger from './logger';

var logger = new Logger({debug: true});
var compiler = new IncrementalCompiler(_fetch, _resolve);
/*
 * load.name: the canonical module name
 * load.address: the URL returned from locate
 * load.metadata: the same metadata object by reference, which
 *   can be modified
 */
export function fetch(load) {
  logger.debug('systemjs fetching ' + load.name + ' ' + load.address);
  var tsname = load.name.split('!')[0];
  return compiler.load(tsname);
}

/*
 * load.name
 * load.address
 * load.metadata
 * load.source: the fetched source
 */
export function translate(load) {
  logger.debug('systemjs translating ' + load.name);
  var tsname = load.name.split('!')[0];

  return compiler.compile(tsname)
    .then(function(output) {
      formatErrors(output.errors, logger);

      if (output.failure) {
        throw new Error("TypeScript compilation failed.");
      } else {
        var origSource = load.source;
        load.source = fixRequires(tsname, output.js);
        load.metadata.sourceMap = output.map;
        load.sourceMap = output.map;

        //load.sourceMap['sourcesContent'] = [origSource];  
      }

      return;
    });
}

/*
 * called by the compiler when it needs to fetch a file
 */
function _resolve(parent, dep) {
    logger.debug("resolving " + parent + " -> " + dep);
    var result = "";

    if (isAbsolute(dep))
        result = dep;
    else if (isRelative(dep))
        result = path.join(path.dirname(parent), dep);
    else
        result = dep;

    if (path.extname(result) != '.ts')
        result = result + ".ts";

    logger.debug('resolved ' + result)
    return result;
}

/*
 * called by the compiler when it needs to fetch a file
 */
function _fetch(name) {
  var load = {
    name: name,
    metadata: {}
  }
  return System.locate(load).then(function(address) {
    logger.debug("located " + address);
    load.address = address;
    return System.fetch(load).then(function(res) {
      logger.debug("fetched " + name);
      return res;
    });
  });
}

