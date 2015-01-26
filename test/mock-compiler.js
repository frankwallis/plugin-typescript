function MockCompiler(results) {
	this.results = results;
}

MockCompiler.prototype.compile = function (inputs) {
	return this.results;
}

module.exports = MockCompiler;