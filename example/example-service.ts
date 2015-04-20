/// <reference path="./_references.d.ts" />

export class ExampleService implements example.IExampleService {

    constructor() {

    }

    greet(name: string): string {
      if (!name)
         name = "clint";

      return "Hello " + name;
    }
}
