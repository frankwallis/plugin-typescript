/* */
import * as ts from "typescript";

export function isAbsolute(filename: string) {
   return (filename[0] === '/');
}

export function isRelative(filename: string) {
   return (filename[0] === '.');
}

export function isAmbientImport(filename: string) {
   return (isAmbient(filename) && !isTypescriptDeclaration(filename));
}

export function isAmbientReference(filename: string) {
   return (isAmbient(filename) && isTypescriptDeclaration(filename));
}

export function isAmbient(filename: string) {
   return (!isRelative(filename) && !isAbsolute(filename));
}

const typescriptRegex = /\.tsx?$/i;
export function isTypescript(filename: string) {
   return typescriptRegex.test(filename);
}

const javascriptRegex = /\.js$/i;
export function isJavaScript(filename: string) {
   return javascriptRegex.test(filename);
}

const mapRegex = /\.map$/i;
export function isSourceMap(filename: string) {
   return mapRegex.test(filename);
}

const declarationRegex = /\.d\.tsx?$/i;
export function isTypescriptDeclaration(filename: string) {
   return declarationRegex.test(filename);
}

const htmlRegex = /\.html$/i;
export function isHtml(filename: string) {
   return htmlRegex.test(filename);
}

export function tsToJs(tsFile: string) {
   return tsFile.replace(typescriptRegex, '.js');
}

export function tsToJsMap(tsFile: string) {
   return tsFile.replace(typescriptRegex, '.js.map');
}

export function jsToDts(jsFile: string) {
   return jsFile.replace(javascriptRegex, '.d.ts');
}

export function stripDoubleExtension(normalized: string) {
   const parts = normalized.split('.');

   if (parts.length > 1) {
      const extensions = ["js", "jsx", "ts", "tsx", "json"];

      if (extensions.indexOf(parts[parts.length - 2]) >= 0) {
         return parts.slice(0, -1).join('.');
      }
   }
   return normalized;
}

export function hasError(diags: Array<ts.Diagnostic>): boolean {
   return diags.some(diag => (diag.category === ts.DiagnosticCategory.Error));
}