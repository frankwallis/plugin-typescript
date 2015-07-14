/* */
import ts from 'typescript';
import Logger from './logger';
import {isJavaScript, isSourceMap} from "./utils";

let logger = new Logger({ debug: false });

export class Transpiler {
	constructor(host) {
		this._host = host;

		this._options = ts.clone(this._host.options);
		this._options.inlineSourceMap = false;
		this._options.sourceMap = (this._options.sourceMap !== false);
		this._options.declaration = false;
		this._options.isolatedModules = true;
		this._options.noResolve = true;
		this._options.noLib = true;
		this._options.module = ts.ModuleKind.System;
	}

	transpile(sourceName, source) {
		logger.debug(`transpiling ${sourceName}`);

		let sourceFile = this._host.addFile(sourceName, source);
		let program = ts.createProgram([sourceName], this._options, this._host);

		let jstext = undefined;
		let maptext = undefined;

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

	hasError(diags) {
		return diags.some((diag) => (diag.category === ts.DiagnosticCategory.Error))
	}
}