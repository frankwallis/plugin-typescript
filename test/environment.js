// manually provide the synthetic default exports when running in nodejs
var typescript = require('typescript')
typescript.default = typescript

require('ts-node').register({
	project: __dirname,
	ignoreWarnings: [2341], // access private members
	disableWarnings: false
})

