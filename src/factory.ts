/* */
import * as ts from 'typescript';
import Logger from './logger';
import {CompilerHost} from './compiler-host';
import {Transpiler} from './transpiler';
import {TypeChecker} from './type-checker';
import {formatErrors} from './format-errors';
import {isTypescriptDeclaration} from "./utils";

let logger = new Logger({ debug: false });

interface FactoryOutput {
	 host: CompilerHost;
	 transpiler: Transpiler;
	 typeChecker: TypeChecker;
}

export function createFactory(options: PluginOptions, _resolve: ResolveFunction, _fetch: FetchFunction): Promise<FactoryOutput> {
	options = options || {};

	if (options.tsconfig) {
		 let tsconfig = (options.tsconfig === true) ? "tsconfig.json" : options.tsconfig as string;

		 return _resolve(tsconfig)
			.then(tsconfigAddress => {
				return _fetch(tsconfigAddress)
					.then(tsconfigText => {
						return {tsconfigAddress, tsconfigText};
					});
			})
			.then(({tsconfigAddress, tsconfigText}) => {
				let ts1 = ts as any;
				let result = ts1.parseConfigFileText ? ts1.parseConfigFileText(tsconfigAddress, tsconfigText) : ts1.parseConfigFileTextToJson(tsconfigAddress, tsconfigText);

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

						return Promise.all<string>(resolutions)
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

function createServices(config: PluginOptions, _resolve: ResolveFunction, _fetch: FetchFunction): Promise<FactoryOutput> {
	let host = new CompilerHost(config);
	let transpiler = new Transpiler(host);
	let typeChecker = undefined;

	if (config.typeCheck) {
		typeChecker = new TypeChecker(host, _resolve, _fetch);

		return _resolve('ts', '')
				.then(moduleName => {
					 return _resolve(host.getDefaultLibFileName(), moduleName)
				})
				.then(defaultLibAddress => {
					typeChecker.registerDeclarationFile(defaultLibAddress, true);
					return {transpiler, typeChecker, host};
				});
	}
	else {
		return Promise.resolve({transpiler, typeChecker, host});
	}
}
