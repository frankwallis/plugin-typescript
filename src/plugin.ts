/* */
import * as ts from 'typescript';
import Logger from './logger';
import {createFactory} from './factory';
import {formatErrors} from './format-errors';
import {isTypescript, isTypescriptDeclaration, stripDoubleExtension, hasError} from './utils';

const logger = new Logger({ debug: false });
let factory = undefined;

/*
 * load.name
 * load.address
 * load.metadata
 * load.source: the fetched source
 */
export function translate(load: Module): Promise<string> {
	const loader = this;
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
			// rollup support needs null/esm to strip out the empty modules,
			// for non-rollup & runtime use ''/cjs
			if (loader.builder && (host.options.module == ts.ModuleKind.ES6)) {
				load.source = null;
				load.metadata.format = 'esm';
			}
			else {
				load.source = '';
				load.metadata.format = 'cjs';
			}
      }
      else {
         const result = transpiler.transpile(load.address);
         formatErrors(result.errors, logger);

         if (result.failure)
            throw new Error('TypeScript transpilation failed');

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

		// builder doesn't call instantiate so type-check now
		if (loader.builder)
			return typeCheck(load).then(() => load.source);
		else
			return Promise.resolve(load.source);
   });
}

// instantiate hook is only called in browser
export function instantiate(load, systemInstantiate) {
	return factory.then(({typeChecker, resolver, host}) => {
		return systemInstantiate(load)
			.then(entry => {
				return typeCheck(load).then((errors) => {
					// at runtime the bundle hook is not called so fail the build immediately
					if ((host.options.typeCheck === "strict") && hasError(errors))
						throw new Error("Typescript compilation failed");

					entry.deps = entry.deps.concat(load.metadata.deps);
					return entry;
				});
			});
		});
}

function typeCheck(load: Module): Promise<any> {
   return factory.then(({typeChecker, resolver, host}) => {
		if (host.options.typeCheck && isTypescript(load.address)) {
			return resolver.resolve(load.address)
				.then(deps => {
					const errors = typeChecker.check();
					formatErrors(errors, logger);

					const depslist = deps.list
						.filter(d => isTypescript(d))
						.map(d => isTypescriptDeclaration(d) ? d + '!' + __moduleName : d);

					load.metadata.deps = depslist;
					return errors;
				});
		}
		else {
			return [];
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
   /* The only time you don't want to output in system format is when you are using rollup or babel
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
			normalized = normalized.split('!')[0];
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
