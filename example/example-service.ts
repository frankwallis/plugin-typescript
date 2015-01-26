/// <reference path="./_references.d.ts" />

//declare module example {
//	interface IExampleGreeter {
//		greet(name: string);
//	}
//}

class Greeter implements example.IGreeterService {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet(name: string) {
        return this.greeting + " " + name;
    }
}

export = Greeter;