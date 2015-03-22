/// <reference path="./_references.d.ts" />

class ExampleService implements example.IExampleService {

    constructor() {

    }

    greet(name: string) {
      if (!name)
         name = "clint";

      return "Hello " + name;
    }
}

export = ExampleService;
