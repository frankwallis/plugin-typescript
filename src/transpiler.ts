/* */
import * as ts from 'typescript';
import {CompilerHost, CombinedOptions} from './compiler-host';
import Logger from './logger';
import {isJavaScript, isSourceMap} from "./utils";

let logger = new Logger({ debug: false });

interface TranspileResult {
	failure: boolean;
	errors: Array<ts.Diagnostic>;
	js: string;
	sourceMap: string;
}

export class Transpiler {
	private _host: CompilerHost;
	private _options: CombinedOptions;

	constructor(host: CompilerHost) {
		this._host = host;

		this._options = (<any>ts).clone(this._host.options);

		if (this._options.sourceMap === undefined)
			this._options.sourceMap = this._options.inlineSourceMap;

		if (this._options.sourceMap === undefined)
			this._options.sourceMap = true;

		this._options.inlineSourceMap = false;
		this._options.declaration = false;
		this._options.isolatedModules = true;
	}

	public transpile(sourceName: string, source: string): TranspileResult {
		logger.debug(`transpiling ${sourceName}`);

		let sourceFile = this._host.addFile(sourceName, source);
		let program = ts.createProgram([sourceName], this._options, this._host);

		let jstext: string = undefined;
		let maptext: string = undefined;

		// Emit
		let emitResult = program.emit(undefined, (outputName, output) => {
			if (isJavaScript(outputName))
				jstext = output.slice(0, output.lastIndexOf("//#")); // remove sourceMappingURL
			else if (isSourceMap(outputName))
				maptext = output;
			else
				throw new Error(`unexpected ouput file ${outputName}`)
		});

		let diagnostics = program.getSyntacticDiagnostics().concat(emitResult.diagnostics);

		return {
			failure: this.hasError(diagnostics),
			errors: diagnostics,
			js: jstext,
			sourceMap: maptext
		}
	}

	private hasError(diags: Array<ts.Diagnostic>): boolean {
		return diags.some(diag => (diag.category === ts.DiagnosticCategory.Error))
	}
}
