require('ts-node').register({
   project: __dirname,
   ignoreWarnings: [2341], // access private members
   disableWarnings: false
});
