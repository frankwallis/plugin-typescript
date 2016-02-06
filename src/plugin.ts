/* */
import * as ts from 'typescript';
import Logger from './logger';
import {createFactory} from './factory';
import {formatErrors} from './format-errors';
import {isTypescript, isTypescriptDeclaration, stripDoubleExtension} from './utils';

const logger = new Logger({ debug: false });
const factory = createFactory(System.typescriptOptions, _resolve, _fetch)
   .then((output) => {
      validateOptions(output.host.options);
      return output;
   });
   
/*
 * load.name
 * load.address
 * load.metadata
 * load.source: the fetched source
 */
export function translate(load: Module): Promise<string> {
	logger.debug(`systemjs translating ${load.address}`);

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

         if (this.loader && (host.options.module === ts.ModuleKind.System))
            load.source = wrapSource(result.js, load);
         else 
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
               var diags = typeChecker.check();
               formatErrors(diags, logger);
                  
               // this makes SystemJS fetch any declaration files 
               // and feed them back through the plugin
               // TODO - use ___moduleName when available?
               deps.list
                  .filter(isTypescriptDeclaration)
                  .forEach(d => System.import(d + "!"));
                  
               return load.source;
            });
      }
      else {
         return load.source;                  
      }
   });
}

export function bundle() {
   return factory.then(({typeChecker, host}) => {
      
      if (host.options.typeCheck) {
         const errors = typeChecker.forceCheck();
         
         if (errors.length > 0) {
            formatErrors(errors, logger);

            if (host.options.typeCheck === "strict")
               throw new Error("Typescript compilation failed");
         }
      }
                     
      return [];
   });
}

function validateOptions(options) {
   /* The only time you don't want to output in system format is when you are using babel 
      downstream to compile es6 output (e.g. for async/await support) */      
   if (options.module != ts.ModuleKind.System) {      
      if ((!System.transpiler || System.transpiler.indexOf("babel") < 0) || (options.target != ts.ScriptTarget.ES6))
         logger.warn(`transpiling to ${(<any>ts).ModuleKind[options.module]}, consider setting module: "system" in typescriptOptions to transpile directly to System.register format`);
   }
}

function wrapSource(source: string, load: Module): string {
	return '(function(__moduleName){' + source + '\n})("' + load.name + '");\n//# sourceURL=' + load.address + '!transpiled';
}

/*
 * called by the factory/resolver when it needs to resolve a file
 */
function _resolve(dep: string, parent: string): Promise<string> {
	// TODO: __moduleName is not available without a built-in transpiler
	//if (!parent) parent = __moduleName;

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
	return System.fetch({ address: address, name: address, metadata: {} })
		.then(text => {
			logger.debug(`fetched ${address}`);
			return text;
		});
}
