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

	var result = requires(data);

	for (var i = 0; i < result.length; i ++) {
		var require = result[i];
		var quote = require.string.match(/"/) ? '"' : "'";
		var fixedPath = fixPath(require.path);

		if (fixedPath) {
			var resolvedRequire = 'require(' + quote + fixedPath + quote + ')';
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
	if (isRelative(pathname) || isAbsolute(pathname)) {
		var filename = path.basename(pathname);

		if (filename.indexOf(".") < 0)
			return pathname + '.ts!';
	}

	return false;
}
