/// <reference path="./_references.d.ts" />
import {Component, Directive, View} from 'angular2/angular2';
import {ExampleService} from "./example-service";
import exampleTemplate from "example-view";

@Component({
  selector: 'example-app',
  viewBindings: [ExampleService]
})
@View({
  template: exampleTemplate,
  directives: []
})
export class ExampleComponent {

	constructor(private exampleService: ExampleService) {
		console.log('constructing ExampleComponent');
		console.log('moduleName is ' + __moduleName);

		this.item = {
			name: "",
			greeting: ""
		}
	}

	public item: any;

  	public handleChangeName(seat, event) {
      this.item.name = event.target.value;
   }

	public greet() {
		console.log('greeting ' + this.item.name);
		this.item.greeting = this.exampleService.greet(this.item.name);
		console.log(this.item.greeting);
	}
}
