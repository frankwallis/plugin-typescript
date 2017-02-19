/* */
import ts from 'typescript'
import Logger from './logger'

/*
 * Convert the diagnostics into structured errors
 */
export function convertErrors(diags: ts.Diagnostic[]): StructuredError[] {
	return diags.reduce((result, diag) => {
		let locationText = undefined

		if (diag.file) {
			// feature: print the compiler output over 2 lines! file then message
			const position = diag.file.getLineAndCharacterOfPosition(diag.start)
			const filename = diag.file.fileName

			// feature: output in format address:line:position to enable direct linking to error location in chrome dev tools
			locationText = `${filename}:${position.line + 1}:${position.character + 1}`
		}

		let messageText = ts.flattenDiagnosticMessageText(diag.messageText, "\n")
		messageText = `${messageText} (TS${diag.code})`

		result.push({
			messageText,
			locationText,
			category: diag.category,
			errorCode: diag.code
		})

		return result
	}, [])
}

/**
 * Write the compiler errors to console
 */
export function outputErrors(errors: StructuredError[], logger: Logger) {
	// feature: don't spam the console, only display the first 10 errors
	errors.slice(0, 10).forEach(error => {
		const write = (error.category === ts.DiagnosticCategory.Error) ? logger.error : logger.warn

		if (error.locationText)
			write(error.locationText)

		write(error.messageText)
	})
}

/**
 * Format the diagnostics and write to the console
 */
export function formatErrors(diags: ts.Diagnostic[], logger: Logger) {
	const errors = convertErrors(diags)
	outputErrors(errors, logger)
}
