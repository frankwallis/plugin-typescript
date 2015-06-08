import path from 'path';
import ts from 'typescript';
import {IncrementalCompiler} from './incremental-compiler';
import formatErrors from './format-errors';
import {fixRequires} from './fix-requires';
import {isRelative, isAbsolute} from './utils';
import Logger from './logger';

let logger = new Logger({debug: false});
let compiler = new IncrementalCompiler(_fetch, _resolve, System.typescriptOptions);

/*
 * load.name: the canonical module name
 * load.address: the URL returned from locate
 * load.metadata: the same metadata object by reference, which
 *   can be modified
 */
export function fetch(load) {
   logger.debug('systemjs fetching ' + load.name + ' ' + load.address + ' ' + JSON.stringify(load.metadata));
   let tsname = load.name.split('!')[0];
   return compiler.load(tsname)
      .then((file) => file.text);
}

/*
 * load.name
 * load.address
 * load.metadata
 * load.source: the fetched source
 */
export function translate(load) {
   // when injecting from a bundle, translate is called for code which has already
   // been compiled. In this situation we can just ignore the file. 
   // see https://github.com/frankwallis/plugin-typescript/issues/19
   if (!load.metadata.pluginFetchCalled)
      return;

   logger.debug('systemjs translating ' + load.name);
   let tsname = load.name.split('!')[0];

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
   if (!parent)
      parent = __moduleName;

   return System.normalize(dep, parent)
      .then(function(normalized) {
         if (path.basename(dep).indexOf('.') < 0) {
            if (path.basename(normalized).indexOf('.') < 0)
               normalized = normalized + '.ts';
            else
               normalized = normalized.slice(0, normalized.length -3) + '.ts';
         }
         
         if (normalized.slice(-6) == '.ts.js')
            normalized = normalized.slice(0, normalized.length -3);
            
         logger.debug('resolved ' + normalized + ' (' + parent + ' -> ' + dep + ')');
         return normalized;
      });
}

/*
 * called by the compiler when it needs to fetch a file
 */
function _fetch(name) {
   let load = {
      name: name,
      metadata: {}
   }

   return System.locate(load)
      .then((address) => {
         // workaround for https://github.com/systemjs/systemjs/issues/319
         if (address.slice(-6) == '.ts.js')
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
