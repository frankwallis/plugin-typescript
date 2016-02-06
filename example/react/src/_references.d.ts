declare module "react" {
	export class Component {
		constructor(props: any);
		protected forceUpdate();
	}

	export function render(component: Component, element: any);
}

declare var __moduleName: string;
