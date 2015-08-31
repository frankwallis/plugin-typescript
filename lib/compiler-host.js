import ts from 'typescript';
import Logger from './logger';
import {isHtml} from './utils';

let logger = new Logger({ debug: false });
let sanitizeRegex = /\.tsx?.ts$/i;
export let __HTML_MODULE__ = "__html_module__";

export class CompilerHost {
	constructor(options) {
		this._options = options || {};
		this._options.module = this._options.module || ts.ModuleKind.System;
		this._options.target = this.getEnum(this._options.target, ts.ScriptTarget, ts.ScriptTarget.ES5);
		this._options.jsx = this.getEnum(this._options.jsx, ts.JsxEmit, ts.JsxEmit.None);
		this._options.allowNonTsExtensions = (this._options.allowNonTsExtensions !== false);

		this._files = {};

		// typescript bug with 'this' incorrectly set when calling resolveModuleNames
		this.resolveModuleNames = (moduleNames, containingFile) => this.resolveModuleNames1(moduleNames, containingFile);

		// support for importing html templates until
		// https://github.com/Microsoft/TypeScript/issues/2709#issuecomment-91968950 gets implemented
		// note - this only affects type-checking, not runtime!
		this.addFile(__HTML_MODULE__, "var __html__: string = ''; export default __html__;");
	}

	getEnum(enumValue, enumType, defaultValue) {
		if (enumValue == undefined) return defaultValue;

		for (var enumProp in enumType) {
			if (enumProp.toLowerCase() == enumValue.toString().toLowerCase()) {
				if (typeof enumType[enumProp] === "string")
					return enumType[enumType[enumProp]];
				else
					return enumType[enumProp];
			}
		}

		throw new Error(`Unrecognised value [${enumValue}]`);
	}

	get options() {
		return this._options;
	}

	getSourceFile(fileName, target) {
		fileName = this.getCanonicalFileName(fileName);
		return this._files[fileName];
	}

	fileExists(fileName) {
		fileName = this.getCanonicalFileName(fileName);
		return !!this._files[fileName];
	}

	writeFile(name, text, writeByteOrderMark) {
		throw new Error("Not implemented");
	}

	getDefaultLibFileName() {
		return "typescript/lib/lib.es6.d.ts";
	}

	useCaseSensitiveFileNames() {
		return false;
	}

	getCanonicalFileName(fileName) {
		if (sanitizeRegex.test(fileName))
			return fileName.slice(0, -3);
		else
			return fileName;
	}

	getCurrentDirectory() {
		return "/";
	}

	getNewLine() {
		return ts.getNewLineCharacter(this._options);
	}

	addFile(filename, text) {
		this._files[filename] = ts.createSourceFile(filename, text, this._options.target);

		logger.debug(`added ${filename}`);
		return this._files[filename];
	}

	resolveModuleNames1(moduleNames, containingFile) {
		return moduleNames.map((modName) => {
			if (isHtml(modName))
				return __HTML_MODULE__;
			else
				return ts.resolveModuleName(modName, containingFile, this._options, this).resolvedFileName;
		});
	}
}
