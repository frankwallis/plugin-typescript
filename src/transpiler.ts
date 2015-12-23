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

		this._options.isolatedModules = true;

		/* arrange for an external source map */
		if (this._options.sourceMap === undefined)
			this._options.sourceMap = this._options.inlineSourceMap;

		if (this._options.sourceMap === undefined)
			this._options.sourceMap = true;

		this._options.inlineSourceMap = false;

		/* these options are incompatible with isolatedModules */
		this._options.declaration = false;
		this._options.noEmitOnError = false;
		this._options.out = undefined;
		this._options.outFile = undefined;

		/* without this we get a 'lib.d.ts not found' error */
		this._options.noLib = true;

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

		let diagnostics = emitResult.diagnostics
			.concat(program.getOptionsDiagnostics())
			.concat(program.getSyntacticDiagnostics());

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
