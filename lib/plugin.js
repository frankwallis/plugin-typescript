import {CompilerHost} from './compiler-host';
import {Transpiler} from './transpiler';
import {TypeChecker} from './type-checker';

import Logger from './logger';
import {formatErrors} from './format-errors';
import {isTypescript} from './utils';

let logger = new Logger({ debug: false });
let host = new CompilerHost(System.typescriptOptions);
let transpiler = new Transpiler(host);
let typeChecker = new TypeChecker(host, _resolve, _fetch);

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

	if (result.failure)
		throw new Error("TypeScript transpilation failed");

	if (host.options.typeCheck && isTypescript(load.address)) {
		typeChecker.check(load.address, load.source)
			.then((diags) => formatErrors(diags, logger))
			.catch((err) => logger.error(err.message));
	}

	load.source = wrapSource(result.js, load);
	load.metadata.sourceMap = result.sourceMap;
	load.metadata.format = 'register';
	return load;
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
		.then(function (normalized) {
			if (normalized.slice(-6) == '.ts.js')
				normalized = normalized.slice(0, -3);

			logger.debug(`resolved ${normalized} (${parent} -> ${dep})`);
			return normalized;
		});
}

/*
 * called by the type-checker when it needs to fetch a file
 */
function _fetch(address) {
	return System.fetch({ address: address, metadata: {} })
		.then((text) => {
			logger.debug(`fetched ${address}`);
			return text;
		})
}
