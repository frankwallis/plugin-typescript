// Need to set global.Promise before loading zone.js for async/await to work
global.Promise = require("babel-runtime/core-js/promise").default;
require('reflect-metadata');
require('zone.js');