// workaround for ridiculous typescript bug where ts.findConfigFile doesn't work at all.
// https://github.com/Microsoft/TypeScript/issues/2965
var orig = process.cwd();
process.chdir(__dirname);
// \workaround

require('ts-node').register({
   project: __dirname,
   ignoreWarnings: [2341], // access private members
   disableWarnings: false
});

process.chdir(orig);
 