import {counter} from './counter';

export interface ICounter {
	index: number;
	elided: number;
}

counter.elided += 1;
