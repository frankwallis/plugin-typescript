/* */
interface LoggerOptions {
	debug?: boolean;
}

class Logger {
	constructor(private options: LoggerOptions) {
		this.options = options || {};
	}

	public log(msg: string) {
		console.log("TypeScript", msg);
	}

	public error(msg: string) {
		console.error("TypeScript", msg);
	}

	public warn(msg: string) {
		console.warn("TypeScript", msg);
	}

	public debug(msg: string) {
		if (this.options.debug) {
			console.log("TypeScript", msg);
		}
	}
}

export default Logger;
