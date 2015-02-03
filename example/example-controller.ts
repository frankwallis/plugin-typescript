/// <reference path="./_references.d.ts" />

class ExampleController {
    
    public static $inject = [ 'exampleService' ];

    constructor(exampleService: example.IExampleService) {
        this.greeting = exampleService.greet('you');
    }
    
}

export = ExampleController;