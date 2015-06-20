/* */
import ts from 'typescript';
import Logger from './logger';

let logger = new Logger({debug: !false});

export class TypeChecker {
	constructor(host) {
      this._host = host;

		this._options = ts.clone(this._host._options);
		this._options.inlineSourceMap = false;
		this._options.sourceMap = false;
		this._options.declaration = false;
		this._options.isolatedModules = false;
		this._options.noResolve = false;
		this._options.noLib = false;
		this._options.module = ts.ModuleKind.System;
		
		this._entries = {};
		this._files = {};
		this._programs = {};
	}

	register(sourceName, source) {
		if (!this._files[sourceName]) {
			this._entries[sourceName] = {
				checked: false
			};
		}
			
		this.addFile(sourceName, source);
		this.performTypeCheck();
	}
	
	addFile(sourceName, source) {
		let file = {
			text: source,
			info: ts.preProcessFile(source, true)
		}
		
		
		
		this.processReferences(file);
		return file;
	}
	
	processReferences(file) {
		
	}
	
	performTypeCheck() {
		
	}
}