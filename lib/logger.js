class Logger {
	constructor(options) {
		this.options = options || {};	
	}
	
	log(msg) {
		if (this.options.verbose || this.options.debug)
			console.log("TypeScript", msg);
	}

	error(msg) {
		console.error("TypeScript", msg);
	}
	
	warn(mag) {
		console.warn("TypeScript", msg);
	}

	debug(msg) {
		if (this.options.debug)
			console.log("TypeScript", msg);
	}
}

export default Logger;
