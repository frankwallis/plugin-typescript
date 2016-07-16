declare module "somelib" {
	export interface SomeLibStatic {
		method1();
	}

	var __SomeLibStatic: SomeLibStatic;
	export default __SomeLibStatic;
}
