import path from 'path';
import ts from 'typescript';
import {IncrementalCompiler} from './incremental-compiler';
import formatErrors from './format-errors';
import {fixRequires} from './fix-requires';
import {isRelative, isAbsolute} from './utils';
import Logger from './logger';

var logger = new Logger({debug: false});
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

         if (output.failure)
            throw new Error("TypeScript compilation failed.");
         else
            load.source = fixRequires(tsname, output.js);

         return;
      });
}

/*
 * called by the compiler when it needs to resolve a file
 */
function _resolve(dep, parent) {
   if (!parent) {
      //parent = __moduleName;
      //workaround for https://github.com/frankwallis/plugin-typescript/issues/9
      if (__moduleAddress.indexOf('github') < 0)
         parent = "npm:plugin-typescript@0.5.10/plugin";
      else
         parent = "github:frankwallis/plugin-typescript@0.5.10/plugin";
   }

   return System.normalize(dep, parent)
      .then(function(normalized) {
         if (path.basename(normalized).indexOf('.') < 0)
            normalized = normalized + '.ts';

         logger.debug('resolved ' + normalized + '(' + parent + ' -> ' + dep + ')');
         return normalized;
      });
}

/*
 * called by the compiler when it needs to fetch a file
 */
function _fetch(name) {
   var load = {
      name: name,
      metadata: {}
   }

   return System.locate(load)
      .then((address) => {
         // workaround for https://github.com/systemjs/systemjs/issues/319
         if (path.extname(address) == '.js')
            address = address.slice(0, -3);

         logger.debug("located " + address);
         load.address = address;
         return System.fetch(load)
            .then((txt) => {
               logger.debug("fetched " + name);
               return txt;
            });
      });
}
