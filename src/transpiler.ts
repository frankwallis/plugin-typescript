/* */
import * as ts from 'typescript';
import {CompilerHost, CombinedOptions, TranspileResult} from './compiler-host';
import {isJavaScript, isSourceMap, hasError} from './utils';
import Logger from './logger';

const logger = new Logger({ debug: false });

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
		this._options.lib = undefined; // incompatible with noLib

		/* without this we get a 'cannot find type-reference' error */
 		this._options.types = [];

      /* without this we get 'cannot overwrite existing file' when transpiling js files */
      this._options.suppressOutputPathCheck = true;

      /* with this we don't get any files */
      this._options.noEmit = false;
   }

   public transpile(sourceName: string): TranspileResult {
      logger.debug(`transpiling ${sourceName}`);

      const file = this._host.getSourceFile(sourceName);
      if (!file) throw new Error(`file [${sourceName}] has not been added`);

      if (!file.output) {
         const program = ts.createProgram([sourceName], this._options, this._host);

         let jstext: string = undefined;
         let maptext: string = undefined;

         // Emit
         const emitResult = program.emit(undefined, (outputName, output) => {
            if (isJavaScript(outputName))
               jstext = output.slice(0, output.lastIndexOf("//#")); // remove sourceMappingURL
            else if (isSourceMap(outputName))
               maptext = output;
            else
               throw new Error(`unexpected ouput file ${outputName}`)
         });

         const diagnostics = emitResult.diagnostics
            .concat(program.getOptionsDiagnostics())
            .concat(program.getSyntacticDiagnostics());

         file.output = {
            failure: hasError(diagnostics),
            errors: diagnostics,
            js: jstext,
            sourceMap: maptext
         };
      }

      return file.output;
   }
}
