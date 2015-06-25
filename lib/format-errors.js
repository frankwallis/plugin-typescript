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
				let position = diag.file.getLineAndCharacterOfPosition(diag.start);
				let filename = diag.file.fileName;
				let locationText = `${filename} (${position.line}, ${position.character}):`;

				if (diag.category === ts.DiagnosticCategory.Error)
					logger.error(locationText);
				else
					logger.warn(locationText);
			}

			let messageText = ts.flattenDiagnosticMessageText(diag.messageText);
			messageText = `${messageText} (TS${diag.code})`;

			if (diag.category === ts.DiagnosticCategory.Error)
				logger.error(messageText);
			else
				logger.warn(messageText);
		});
}