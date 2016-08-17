/* */
import * as ts from "typescript";


// inspired by https://github.com/alm-tools/alm/blob/5c9f087ab82347bca0561259ee97ccf934e93dad/src/server/workers/lang/core/typeScriptDir.ts

/** From the compiler's commandLineParser we find the `lib` to `fileName` mapping */
// for some reasons optionDeclarations is not exposed in typings but it is there
const libOption = (ts as any).optionDeclarations.find(x => x.name === "lib");
const libToFileNameMap = libOption.element.type as ts.Map<string>;

const DEFAULT_LIB_FILE = "lib.d.ts";
const DEFAULT_LIB_NAME = "lib";
const LIB_NAME_REGEX = /lib\.(.*)\.d\.ts/;

/**
 * Based on the compiler options returns you the lib files that should be included.
 * Return type is array of pairs, where first element represents reference name that typescript
 * use to request library file, and second element represents corresponding file name.
 */
export function getDefaultLibFilePaths(options: ts.CompilerOptions): [string, string][] {
    if (options.noLib) {
        return [];
    }
    if (options.lib) {
      return options.lib.map<[string, string]>(
        (lib) => [libReference(lib), fileFromLibFolder(libToFileNameMap[lib])]
      );
    } else {
      const libFileName = ts.getDefaultLibFileName(options);
      let libRef;
      if (libFileName === DEFAULT_LIB_FILE) {
        libRef = libReference("lib");
      } else {
        libRef = libReference(libFileName.match(LIB_NAME_REGEX)[1]);
      }
      return [[libRef, fileFromLibFolder(libFileName)]];
    }
};

function libReference(libName: string): string {
  return `typescript/lib/${libName}`;
}

/** Returns you the filePath of a fileName from the TypeScript lib folder */
function fileFromLibFolder(fileName: string) {
    return "typescript/lib/" + fileName;
}
