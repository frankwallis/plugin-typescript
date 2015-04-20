/// <reference path="./_references.d.ts" />

export class ExampleController {

    public static $inject = [ 'exampleService' ];

    constructor(private exampleService: example.IExampleService) {
        console.log('contstructing ExampleController')
    }

    public name: string;
    public greeting: string;

    public greet() {
    	console.log('greeting');
		this.greeting = this.exampleService.greet(this.name);
    }
}
