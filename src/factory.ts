/* */
import * as ts from 'typescript';
import Logger from './logger';
import {CompilerHost} from './compiler-host';
import {Transpiler} from './transpiler';
import {Resolver} from './resolver';
import {TypeChecker} from './type-checker';
import {formatErrors} from './format-errors';
import {isTypescriptDeclaration} from "./utils";

const logger = new Logger({ debug: false });

type FactoryOutput = {
	 host: CompilerHost;
	 transpiler: Transpiler;
    resolver: Resolver;
	 typeChecker: TypeChecker;
	 options: PluginOptions;
}

/*
	This code looks a lot better with async functions...
*/
export function createFactory(sjsconfig: PluginOptions = {}, _resolve: ResolveFunction, _fetch: FetchFunction): Promise<FactoryOutput> {
	const tsconfigFiles = [];
	const typingsFiles = [];

	return loadOptions(sjsconfig, _resolve, _fetch)
		.then(options => {
			return createServices(options, _resolve, _fetch);
		})
		.then(services => {
			if (services.options.typeCheck) {
				return resolveDeclarationFiles(services.options, _resolve)
					.then(resolvedFiles => {
						resolvedFiles.forEach(resolvedFile => {
							services.resolver.registerDeclarationFile(resolvedFile, false);
						});
						return services;
					});
			}
			else {
				return services;
			}
		});
}

function loadOptions(sjsconfig: PluginOptions, _resolve: ResolveFunction, _fetch: FetchFunction): Promise<PluginOptions> {
	if (sjsconfig.tsconfig) {
		const tsconfig = (sjsconfig.tsconfig === true) ? "tsconfig.json" : sjsconfig.tsconfig as string;

		return _resolve(tsconfig)
			.then(tsconfigAddress => {
				return _fetch(tsconfigAddress).then(tsconfigText => ({tsconfigText, tsconfigAddress}));
			})
			.then(({tsconfigAddress, tsconfigText}) => {
				const ts1 = ts as any; // support TS 1.6.2 and > 1.7
				const result = ts1.parseConfigFileText ?
					ts1.parseConfigFileText(tsconfigAddress, tsconfigText) :
					ts1.parseConfigFileTextToJson(tsconfigAddress, tsconfigText);

				if (result.error) {
					formatErrors([result.error], logger);
					throw new Error(`failed to load tsconfig from ${tsconfigAddress}`);
				}

				const files = result.config.files;
				return (<any>ts).extend((<any>ts).extend({ tsconfigAddress, files }, sjsconfig), result.config.compilerOptions);
			});
	}
	else {
		return Promise.resolve(sjsconfig);
	}
}

function resolveDeclarationFiles(options: PluginOptions, _resolve: ResolveFunction): Promise<string[]> {
	const files = options.files || [];

	let declarationFiles = files
		.filter(filename => isTypescriptDeclaration(filename))
		.map(filename => _resolve(filename, options.tsconfigAddress));

	return Promise.all<string>(declarationFiles);
}

function createServices(options: PluginOptions, _resolve: ResolveFunction, _fetch: FetchFunction): Promise<FactoryOutput> {
	const host = new CompilerHost(options);
	const transpiler = new Transpiler(host);
   
   let resolver = undefined; 
	let typeChecker = undefined;
   
	if (options.typeCheck) {
      resolver = new Resolver(host, _resolve, _fetch);
		typeChecker = new TypeChecker(host);

		if (!host.options.noLib) {
			// TODO - remove this when __moduleName is available
			return _resolve('ts', '')
				.then(moduleName => {
					 return _resolve(host.getDefaultLibFileName(), moduleName)
				})
				.then(defaultLibAddress => {
					resolver.registerDeclarationFile(defaultLibAddress, true);
					return {host, transpiler, resolver, typeChecker, options};
				});
		}
	}

	return Promise.resolve({host, transpiler, resolver, typeChecker, options});
}
