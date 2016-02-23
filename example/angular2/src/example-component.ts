import {Component, View, ChangeDetectionStrategy} from 'angular2/core';
import {ExampleService} from "example-service/example-service";
import exampleTemplate from "./example-view.html";

@Component({
  selector: 'example-component',
  viewBindings: [ExampleService],
  changeDetection: ChangeDetectionStrategy.CheckAlways
})
@View({
  template: exampleTemplate,
  directives: [] 
})
export class ExampleComponent {

	constructor(private exampleService: ExampleService) {
		console.log('constructing ExampleComponent');
	}

	public name = "";
	public greeting = "";
	
  	public handleChangeName(event) {
      this.name = event.target.value;
   }

	public greet() {
		console.log('greeting ' + this.name);
		this.greeting = this.exampleService.greet(this.name);
		console.log(this.greeting);
		this.name = "";
	}
   
	// public async greet() {
	// 	console.log('greeting ' + this.name);
	// 	this.greeting = await this.exampleService.greetAsync(this.name);
	// 	console.log(this.greeting);
	// 	this.name = "";
	// }
}
