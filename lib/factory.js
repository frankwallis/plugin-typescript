import ts from 'typescript';
import Logger from './logger';
import {CompilerHost} from './compiler-host';
import {Transpiler} from './transpiler';
import {TypeChecker} from './type-checker';
import {formatErrors} from './format-errors';
import {isTypescriptDeclaration} from "./utils";

let logger = new Logger({ debug: false });

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
				let result = ts.parseConfigFileText ? ts.parseConfigFileText(tsconfigAddress, tsconfigText) : ts.parseConfigFileTextToJson(tsconfigAddress, tsconfigText);

				if (result.error) {
					formatErrors([result.error], logger);
					throw new Error(`failed to load tsconfig from ${tsconfigAddress}`);
				}

				let config = Object.assign(result.config.compilerOptions, options);
				let files = result.config.files || [];

				return createServices(config, _resolve, _fetch)
					.then(services => {
						let resolutions = files
							.filter(filename => isTypescriptDeclaration(filename))
							.map(filename => _resolve(filename, tsconfigAddress));

						return Promise.all(resolutions)
							.then(resolvedFiles => {
								resolvedFiles.forEach(resolvedFile => {
									services.typeChecker.registerDeclarationFile(resolvedFile, false);
								});
								return services;
							});
					});
			});
	}
	else {
		return createServices(options, _resolve, _fetch);
	}
}

function createServices(config, _resolve, _fetch) {
	let host = new CompilerHost(config);
	let transpiler = new Transpiler(host);
	let typeChecker = false;

	if (config.typeCheck) {
		typeChecker = new TypeChecker(host, _resolve, _fetch);

		return _resolve(host.getDefaultLibFileName())
			.then(defaultLibAddress => {
				typeChecker.registerDeclarationFile(defaultLibAddress, true);
				return {transpiler, typeChecker, host};
			});
	}
	else {
		return Promise.resolve({transpiler, typeChecker, host});
	}
}
