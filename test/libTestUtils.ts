import fs = require('fs');

import {CompilerHost} from '../src/compiler-host';

const defaultLibFile = fs.readFileSync(
  require.resolve('../node_modules/typescript/lib/lib.d.ts'), 'utf8'
);
const es6LibFile = fs.readFileSync(
  require.resolve('../node_modules/typescript/lib/lib.es6.d.ts'), 'utf8'
);
const es2015PromiseLibFile = fs.readFileSync(
  require.resolve('../node_modules/typescript/lib/lib.es2015.promise.d.ts'), 'utf8'
);

/**
 * Add some libs to CompilerHost.
 */
export function addLibFiles(host: CompilerHost): CompilerHost {
  const lib = host.addFile('typescript/lib/lib', defaultLibFile);
  lib.isDefaultLibFile = true;
  const es6 = host.addFile('typescript/lib/lib.es6', es6LibFile);
  es6.isDefaultLibFile = true;
  const es2015 = host.addFile('typescript/lib/lib.es2015.promise', es2015PromiseLibFile);
  es2015.isDefaultLibFile = true;
  return host;
}
