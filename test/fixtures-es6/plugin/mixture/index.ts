declare module 'testsrc/commonjs' {
	export function double(num: number): number;
}

declare module 'testsrc/esm' {
	export function triple(num: number): number;
}

declare module 'testsrc/amd' {
	export function quadruple(num: number): number;
}

import {double} from 'testsrc/commonjs';
import {triple} from 'testsrc/esm';
import {quadruple} from 'testsrc/amd';

export var total = double(triple(quadruple(2)));
