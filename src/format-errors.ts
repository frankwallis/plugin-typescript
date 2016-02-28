/* */
import * as ts from 'typescript';
import Logger from './logger';

/**
 * Write the compiler errors to console
 */
export function formatErrors(diags: ts.Diagnostic[], logger: Logger) {
   // feature: don't spam the console, only display the first 10 errors
   diags.slice(0, 10)
      .forEach(diag => {
         if (diag.file) {
            // feature: print the compiler output over 2 lines! file then message
            const position = diag.file.getLineAndCharacterOfPosition(diag.start);
            const filename = diag.file.fileName;

            // feature: output in format address:line:position to enable direct linking to error location in chrome dev tools
            const locationText = `${filename}:${position.line + 1}:${position.character + 1}`;

            if (diag.category === ts.DiagnosticCategory.Error)
               logger.error(locationText);
            else
               logger.warn(locationText);
         }

         let messageText = ts.flattenDiagnosticMessageText(diag.messageText, "\n");
         messageText = `${messageText} (TS${diag.code})`;

         if (diag.category === ts.DiagnosticCategory.Error)
            logger.error(messageText);
         else
            logger.warn(messageText);
      });
}
