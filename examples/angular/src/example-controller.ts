import {IExampleService} from './example-types'

export class ExampleController {

	public static $inject = ['exampleService'];

	constructor(private exampleService: IExampleService) {
		console.log('constructing ExampleController');
		try {
			console.log('moduleName is ' + __moduleName);
		}
		catch (ex) {}
	}

	public name: string;
	public greeting: string;

	public greet() {
		console.log('greeting');
		this.greeting = this.exampleService.greet(this.name);
	}
}
