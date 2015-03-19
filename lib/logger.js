function Logger(options) {
	options = options || {};

	return {
		log: function(msg) {
			if (options.verbose || options.debug)
				console.log("TypeScript", msg);
		},
		error: function(msg) {
			console.error("TypeScript", msg);
		},
		warn: function(mag) {
			console.warn("TypeScript", msg);
		},
		debug: function(msg) {
			if (options.debug)
				console.log("TypeScript", msg);
		}
	}
}

export default Logger;
