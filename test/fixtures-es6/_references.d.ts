/// <reference path="./external.d.ts" />

declare var require: (string) => void;

interface IDataType {
	key: string;
	value: any;
}

declare module decisions {
	const enum Either {
		Yes = 1, No = 2
	}
}
