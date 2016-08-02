declare module "somelib" {
	interface SomeLibStatic {
		method2();
	}
}

import a from "somelib";
a.method1();
a.method2();
