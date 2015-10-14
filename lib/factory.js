import ts from 'typescript';
import {CompilerHost} from './compiler-host';
import {Transpiler} from './transpiler';
import {TypeChecker} from './type-checker';
import {formatErrors} from './format-errors';

export function createFactory(options, _resolve, _fetch) {
	options = options || {};

	if (options.tsconfig === true)
		options.tsconfig = "tsconfig.json";

	if (options.tsconfig) {
		return _resolve(options.tsconfig)
			.then(tsconfigAddress => {
				return _fetch(tsconfigAddress)
					.then(tsconfigText => {
						return {tsconfigAddress, tsconfigText};
					});
			})
			.then(({tsconfigAddress, tsconfigText}) => {
				let result = ts.parseConfigFileText(tsconfigAddress, tsconfigText);

				if (result.error) {
					formatErrors([result.error], logger);
					throw new Error(`failed to load tsconfig from ${tsconfigAddress}`);
				}

				console.log(JSON.stringify(result));

				let config = Object.assign(result.config.compilerOptions, options);
				return createServices(config, _resolve, _fetch);
			});
	}
	else {
		let services = createServices(options, _resolve, _fetch);
		return Promise.resolve(services);
	}
}

function createServices(config, _resolve, _fetch) {
	let host = new CompilerHost(config);
	let transpiler = new Transpiler(host);
	let typeChecker = config.typeCheck ? new TypeChecker(host, _resolve, _fetch) : false;
	return {transpiler, typeChecker};
}
