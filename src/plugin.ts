/* */
import * as ts from 'typescript';
import Logger from './logger';
import {createFactory} from './factory';
import {formatErrors} from './format-errors';
import {isTypescript, stripDoubleExtension} from './utils';

let logger = new Logger({ debug: false });
let factory = createFactory(System.typescriptOptions, _resolve, _fetch);
let typeCheckErrored = false;

/*
 * load.name
 * load.address
 * load.metadata
 * load.source: the fetched source
 */
export function translate(load: Module): Promise<string> {
	logger.debug(`systemjs translating ${load.address}`);

	return factory.then(({transpiler, typeChecker, host}) => {
		let result = transpiler.transpile(load.address, load.source);
		formatErrors(result.errors, logger);

		if (result.failure)
			throw new Error("TypeScript transpilation failed");

		if (host.options.typeCheck && isTypescript(load.address)) {
			typeChecker.check(load.address, load.source)
				.catch(err => logger.error(err.message))
				.then(diags => {
					formatErrors(diags, logger);
					
					if (diags.some(diag => diag.category === ts.DiagnosticCategory.Error))
						typeCheckErrored = true;
				});
		}

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

		return load.source;
	});
}

function wrapSource(source: string, load: Module): string {
	return '(function(__moduleName){' + source + '\n})("' + load.name + '");\n//# sourceURL=' + load.address + '!transpiled';
}

export function bundle() {
	if (typeCheckErrored && System.typescriptOptions.typeCheck === "strict") {
		typeCheckErrored = false;
		throw new Error("TypeScript found type errors");
	}
	
	return [];
}

/*
 * called by the type-checker when it needs to resolve a file
 */
function _resolve(dep: string, parent: string): Promise<string> {
	// TODO: __moduleName is not available without a built-in transpiler
	//if (!parent) parent = __moduleName;

	return System.normalize(dep, parent)
		.then(normalized => {
			normalized = stripDoubleExtension(normalized);

			logger.debug(`resolved ${normalized} (${parent} -> ${dep})`);
			return normalized;
		});
}

/*
 * called by the type-checker when it needs to fetch a file
 */
function _fetch(address: string): Promise<string> {
	return System.fetch({ address: address, name: address, metadata: {} })
		.then(text => {
			logger.debug(`fetched ${address}`);
			return text;
		})
}
