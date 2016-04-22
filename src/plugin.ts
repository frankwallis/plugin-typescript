/* */
import * as ts from 'typescript';
import Logger from './logger';
import {createFactory} from './factory';
import {formatErrors} from './format-errors';
import {isTypescript, isTypescriptDeclaration, stripDoubleExtension} from './utils';

const logger = new Logger({ debug: false });
let factory = undefined;
   
/*
 * load.name
 * load.address
 * load.metadata
 * load.source: the fetched source
 */
export function translate(load: Module): Promise<string> {
   logger.debug(`systemjs translating ${load.address}`);

   factory = factory || createFactory(System.typescriptOptions, this.builder, _resolve, _fetch, _lookup)
      .then((output) => {
         validateOptions(output.host.options);
         return output;
      });

   return factory.then(({transpiler, resolver, typeChecker, host}) => {
      host.addFile(load.address, load.source);

      // transpile
      if (isTypescriptDeclaration(load.address)) {
         load.source = "";
      }
      else {
         const result = transpiler.transpile(load.address);
         formatErrors(result.errors, logger);

         if (result.failure)
            throw new Error("TypeScript transpilation failed");

         load.source = result.js;

         if (result.sourceMap)
            load.metadata.sourceMap = JSON.parse(result.sourceMap);

         if (host.options.module === ts.ModuleKind.System)
            load.metadata.format = 'register';
         else if (host.options.module === ts.ModuleKind.ES6)
            load.metadata.format = 'esm';
         else if (host.options.module === ts.ModuleKind.CommonJS)
            load.metadata.format = 'cjs';
      }
      
      // type-check?
      if (host.options.typeCheck && isTypescript(load.address)) {
         return resolver.resolve(load.address)
            .then(deps => {
               const diags = typeChecker.check();
               formatErrors(diags, logger);
                  
               // this makes SystemJS fetch any dependencies 
               // and feed them back through the plugin
               deps.list
                  .filter(isTypescript)
                  .forEach(d => {
                     // prevents typescript modules from being evaluated twice
                     const name = isTypescriptDeclaration(d) ? d + "!" + __moduleName : d;

                     System.import(name)
                        .catch(err => { 
                           logger.error(err);
                           throw err;
                         });
                  });

               return load.source;
            });
      }
      else {
         return load.source;
      }
   });
}

export function bundle() {
   if (!factory) return [];

   return factory.then(({typeChecker, host}) => {

      if (host.options.typeCheck) {
         const errors = typeChecker.forceCheck();
         formatErrors(errors, logger);

         if ((host.options.typeCheck === "strict") && typeChecker.hasErrors())
            throw new Error("Typescript compilation failed");
      }

      return [];
   });
}

function validateOptions(options) {
   /* The only time you don't want to output in system format is when you are using babel 
      downstream to compile es6 output (e.g. for async/await support) */
   if ((options.module != ts.ModuleKind.System) && (options.module != ts.ModuleKind.ES6)) {
      logger.warn(`transpiling to ${ts.ModuleKind[options.module]}, consider setting module: "system" in typescriptOptions to transpile directly to System.register format`);
   }
}

/*
 * called by the factory/resolver when it needs to resolve a file
 */
function _resolve(dep: string, parent: string): Promise<string> {
   if (!parent) parent = __moduleName;

   return System.normalize(dep, parent)
      .then(normalized => {
         normalized = stripDoubleExtension(normalized);

         logger.debug(`resolved ${normalized} (${parent} -> ${dep})`);
         return (ts as any).normalizePath(normalized);
      });
}

/*
 * called by the factory/resolver when it needs to fetch a file
 */
function _fetch(address: string): Promise<string> {
   return System.fetch({ name: address, address, metadata: {} })
      .then(text => {
         logger.debug(`fetched ${address}`);
         return text;
      });
}

/*
 * called by the resolver when it needs to get metadata for a file
 */
function _lookup(address: string): Promise<any> {
   const metadata = {};
   return System.locate({ name: address, address, metadata })
      .then(() => {
         // metadata.typings, metadata.typescriptOptions etc should all now be populated correctly,
         // respecting the composition of all global metadata, wildcard metadata and package metadata correctly
         logger.debug(`located ${address}`);
         return metadata;
      });
}
