import ts from 'typescript';
import Logger from './logger';
import {createFactory} from './factory';
import {formatErrors} from './format-errors';
import {isTypescript} from './utils';

let logger = new Logger({ debug: false });
let factory = createFactory(System.typescriptOptions, _resolve, _fetch);

/*
 * load.name
 * load.address
 * load.metadata
 * load.source: the fetched source
 */
export function translate(load) {
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

					if (host.options.typeCheck === "strict") {
						if (diags.some(diag => diag.category === ts.DiagnosticCategory.Error))
							throw new Error("TypeScript typechecker found errors");
					}
				});
		}

		load.source = wrapSource(result.js, load);
		load.metadata.sourceMap = result.sourceMap;
		load.metadata.format = 'register';
		return load;
	});
}

function wrapSource(source, load) {
	return '(function(__moduleName){' + source + '\n})("' + load.name + '");\n//# sourceURL=' + load.address + '!transpiled';
}

/*
 * called by the type-checker when it needs to resolve a file
 */
function _resolve(dep, parent) {
	if (!parent) parent = __moduleName;

	return System.normalize(dep, parent)
		.then(normalized => {
			if (normalized.slice(-6) == '.ts.js')
				normalized = normalized.slice(0, -3);
			else if (normalized.slice(-8) == '.json.js')
				normalized = normalized.slice(0, -3);

			logger.debug(`resolved ${normalized} (${parent} -> ${dep})`);
			return normalized;
		});
}

/*
 * called by the type-checker when it needs to fetch a file
 */
function _fetch(address) {
	return System.fetch({ address: address, name: address, metadata: {} })
		.then(text => {
			logger.debug(`fetched ${address}`);
			return text;
		})
}
