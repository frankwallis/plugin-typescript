/* */
import * as ts from 'typescript';
import Logger from './logger';
import { CompilerHost, CombinedOptions } from './compiler-host';
import { Transpiler } from './transpiler';
import { Resolver } from './resolver';
import { TypeChecker } from './type-checker';
import { formatErrors } from './format-errors';
import { isTypescriptDeclaration } from './utils';

const logger = new Logger({ debug: false });

export interface FactoryOutput {
	host: CompilerHost;
	transpiler: Transpiler;
	resolver: Resolver;
	typeChecker: TypeChecker;
	options: PluginOptions;
}

export async function createFactory(
	sjsconfig: PluginOptions = {},
	builder: boolean,
	_resolve: ResolveFunction,
	_fetch: FetchFunction,
	_lookup: LookupFunction): Promise<FactoryOutput> {

	const tsconfigFiles = [];
	const typingsFiles = [];
	const options = await loadOptions(sjsconfig, _resolve, _fetch);
	const services = await createServices(options, builder, _resolve, _lookup);

	if (services.options.typeCheck) {
		const resolvedFiles = await resolveDeclarationFiles(services.options, _resolve);
		resolvedFiles.forEach(resolvedFile => {
			services.resolver.registerDeclarationFile(resolvedFile);
		});
	}

	return services;
}

async function loadOptions(sjsconfig: PluginOptions, _resolve: ResolveFunction, _fetch: FetchFunction): Promise<PluginOptions> {
	if (sjsconfig.tsconfig) {
		const tsconfig = (sjsconfig.tsconfig === true) ? "tsconfig.json" : sjsconfig.tsconfig as string;

		const tsconfigAddress = await _resolve(tsconfig);
		const tsconfigText = await _fetch(tsconfigAddress);
		const result = ts.parseConfigFileTextToJson(tsconfigAddress, tsconfigText);

		if (result.error) {
			formatErrors([result.error], logger);
			throw new Error(`failed to load tsconfig from ${tsconfigAddress}`);
		}

		const files = result.config.files;
		return (<any>ts).extend((<any>ts).extend({ tsconfigAddress, files }, sjsconfig), result.config.compilerOptions);
	}
	else {
		return sjsconfig;
	}
}

function resolveDeclarationFiles(options: PluginOptions, _resolve: ResolveFunction): Promise<string[]> {
	const files = options.files || [];

	const declarationFiles = files
		.filter(filename => isTypescriptDeclaration(filename))
		.map(filename => _resolve(filename, options.tsconfigAddress));

	return Promise.all<string>(declarationFiles);
}

async function createServices(options: PluginOptions, builder: boolean,
	_resolve: ResolveFunction, _lookup: LookupFunction): Promise<FactoryOutput> {
	const host = new CompilerHost(options, builder);
	const transpiler = new Transpiler(host);

	let resolver: Resolver = undefined;
	let typeChecker: TypeChecker = undefined;

	if (options.typeCheck) {
		resolver = new Resolver(host, _resolve, _lookup);
		typeChecker = new TypeChecker(host);

		if (!host.options.noLib) {
			const defaultLibResolutions = host.getDefaultLibFilePaths().map(libPath => _resolve(libPath));
			const defaultLibAddresses = await Promise.all(defaultLibResolutions);
			defaultLibAddresses.forEach(defaultLibAddress => {
				resolver.registerDeclarationFile(defaultLibAddress);
			});
		}
	}

	return { host, transpiler, resolver, typeChecker, options };
}
