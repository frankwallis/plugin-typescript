import path from 'path';
import requires from 'requires';
import {isRelative, isAbsolute} from './utils';

/**
 * Appends the '.ts!' extension to internal require paths which do not already have an extension
 *
 * @param {string} the filename
 * @param {string} the source
 * @return {string} the fixed up source
 * @api public
 */
export function fixRequires(filename, data) {

	let result = requires(data);

	for (let i = 0; i < result.length; i ++) {
		let require = result[i];
		let quote = require.string.match(/"/) ? '"' : "'";
		let fixedPath = fixPath(require.path);

		if (fixedPath) {
			let resolvedRequire = `require(${quote + fixedPath + quote})`;
			data = data.replace(require.string, resolvedRequire);
		}
	}

	return data;
}

/**
 * Appends the '.ts!' extension to filenames which do not already have an extension
 *
 * @param {string} the filename
 * @return {string} the fixed up filename
 * @api private
 */
function fixPath(pathname) {
	// FW - this fix is to enable you to require files within an ambient module
	// e.g. require("mycomponent/mocks") will go to require("mycomponent/mocks.ts")
	// unfortunately we have no way of knowing whether that file is typescript or 
	// javascript so I'm defaulting to typescript as that is my current use-case...

	//if (isRelative(pathname) || isAbsolute(pathname)) {
	if (pathname.indexOf("/") >= 0) {
		let filename = path.basename(pathname);

		if (filename.indexOf(".") < 0)
			return pathname + '.ts!';
		else if (path.extname(filename) == ".js")
			return pathname.slice(0, -3);
	}

	return false;
}
