/// <reference path="./_references.d.ts" />

class ExampleService implements example.IExampleService {

    constructor() {

    }

    greet(name: string) {
        return "Hello " + name;
    }
}

export = ExampleService;
