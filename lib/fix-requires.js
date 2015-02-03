import path from 'path';
import requires from 'requires';

/**
 * Workaround for https://github.com/duojs/duo/pull/418
 * Appends the '.ts' extension to internal require paths which do not already have an extension
 * Only applied to .js files
 * 
 * @param {string} the filename
 * @param {string} the source
 * @return {string} the fixed up source
 * @api public
 */
function fixRequires(filename, data) {

	if (isJavascript(filename)) {
		// rewrite all the requires
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
	}
	return data;
}

/**
 * Appends the '.ts' extension to internal require paths which do not already have an extension
 * 
 * @param {string} the filename
 * @return {string} the fixed up filename
 * @api private
 */
function fixPath(pathname) {
	var isRelative = './' == pathname.slice(0, 2);
  	var isParent = '..' == pathname.slice(0, 2);
  	var isAbsolute = '/' == pathname[0];

  	if (isRelative || isParent || isAbsolute) {
  		var filename = path.basename(pathname);
  		
  		if (filename.indexOf(".") < 0)
  			return pathname + '.ts!';
     // else if (path.extname(filename) == '.js')
       // return pathname.substr(0, pathname.length -3);
  	}

  	return false;
}

function isJavascript(file) {
	return (/\.js$/i).test(file);
}

export default = fixRequires;