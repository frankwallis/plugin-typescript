import { counter } from './counter'
import { ICounter } from './elided'
import { doit } from './imported'
console.log(doit());
(counter as ICounter).index += 1;
export { counter }
