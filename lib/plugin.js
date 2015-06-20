import path from 'path';
import ts from 'typescript';

import {CompilerHost} from './compiler-host';
import {Transpiler} from './transpiler';
import {TypeChecker} from './type-checker';

import formatErrors from './format-errors';
import {isRelative, isAbsolute} from './utils';
import Logger from './logger';

let logger = new Logger({debug: true});
let host = new CompilerHost(System.typescriptOptions);
let transpiler = new Transpiler(host);
let typeChecker = new TypeChecker(host, _fetch, _resolve);

/*
 * load.name
 * load.address
 * load.metadata
 * load.source: the fetched source
 */
export function translate(load) {
   logger.debug(`systemjs translating ${load.address}`);
   
   let result = transpiler.transpile(load.address, load.source);
   formatErrors(result.errors, logger);
   
   if (result.failure) {
      throw new Error("TypeScript transpilation failed");
   } 
   else {
      load.source = result.js;
      load.metadata.sourceMap = result.sourceMap;
      load.metadata.format == 'register';
      
      if (System.typescriptOptions.typeCheck)
         typeChecker.register(load.address, load.source);
   }
   
   return load;
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
