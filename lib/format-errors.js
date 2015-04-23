import ts from 'typescript';

/**
 * Write the compiler errors to console
 *
 * @param {array} the TypeScript compiler errors
 * @param {Logger} the output console
 */
export function formatErrors(diags, logger) {
	// feature: don't spam the console, only display the first 10 errors
	diags.slice(0, 10)
		.forEach((diag) => {
			if (diag.file) {
				// feature: print the compiler output over 2 lines! file then message
				var loc = diag.file.getLineAndCharacterOfPosition(diag.start);
				var filename = diag.file.fileName.slice(1);
				var output = filename + "(" + loc.line + "," + loc.character + "): ";

				// TODO - get these to work as source hyperlinks in chrome?
				if (diag.category === ts.DiagnosticCategory.Error)
					logger.error(output)
				else
					logger.warn(output)
			}

			// workaround for weird compiler bug
			var messageText = diag.messageText;

			if (messageText.messageText)
				messageText = messageText.messageText;

			if (diag.category === ts.DiagnosticCategory.Error)
				logger.error(messageText + " (TS" + diag.code + ")");
			else
				logger.warn(messageText + " (TS" + diag.code + ")");
		});
}

export default formatErrors;
