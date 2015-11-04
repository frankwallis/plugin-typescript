import {Component, Directive, View, NgModel} from 'angular2/angular2';
import {ExampleService} from "example-service/example-service";
import exampleTemplate from "./example-view.html";

@Component({
  selector: 'example-app',
  viewBindings: [ExampleService]
})
@View({
  template: exampleTemplate,
  directives: [NgModel]
})
export class ExampleComponent {

	constructor(private exampleService: ExampleService) {
		console.log('constructing ExampleComponent');
		console.log('moduleName is ' + __moduleName);
	}

	public item = {
		name: "",
		greeting: ""
	};

  	public handleChangeName(seat, event) {
      this.item.name = event.target.value;
   }

	public greet() {
		console.log('greeting ' + this.item.name);
		this.item.greeting = this.exampleService.greet(this.item.name);
		console.log(this.item.greeting);
	}
}
