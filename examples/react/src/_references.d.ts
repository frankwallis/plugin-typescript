declare module "react" {
	export class Component {
		constructor(props: any);
		protected forceUpdate();
	}
}

declare module "react-dom" {
	import * as React from "react";
	export function render(component: React.Component, element: any);
}
