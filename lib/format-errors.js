import ts from 'typescript';

/**
 * Write the compiler errors to console
 *
 * @param {array} the TypeScript compiler errors
 * @param {Logger} the output console
 */
function formatErrors(diags, logger) {
	// feature: don't spam the console, only display the first 10 errors
	diags.slice(0, 10)
		.forEach((diag) => {
			if (diag.file) {
				// feature: print the compiler output over 2 lines! file then message if (diag.file) {
				var loc = diag.file.getLineAndCharacterFromPosition(diag.start);
				var filename = diag.file.filename; //Compiler.normalizePath(path.relative(entry.root, diag.file.filename));
				var output = filename + "(" + loc.line + "," + loc.character + "): ";

				// TODO - get these to work as source hyperlinks in chrome?
				if (diag.category === ts.DiagnosticCategory.Error)
					logger.error(output)
				else
					logger.warn(output)
			}

			if (diag.category === ts.DiagnosticCategory.Error)
				logger.error(diag.messageText + " (TS" + diag.code + ")");
			else
				logger.warn(diag.messageText + " (TS" + diag.code + ")");
		});
}

export default formatErrors;