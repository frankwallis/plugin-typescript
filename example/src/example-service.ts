/// <reference path="./_references.d.ts" />
import {Injectable} from 'angular2/angular2';

@Injectable()
export class ExampleService {

	constructor() {
		this.cache = new Map<string, string>();

		//var a = Symbol();
	}

	private cache: Map<string, string>;

	greet(name: string): string {
		name = name || "clint"; // obligatory
		let greeting = this.cache[name] ? this.cache[name] : "Hello " + name;
		this.cache[name] = greeting;

		return greeting;
	}
}
