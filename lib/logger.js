function capitalise(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = function(options) {
	options = options || {};
	
	return {
		log: function(arg1, arg2) {
			console.log(capitalise(arg1), arg2);
		},
		error: function(arg1, arg2) {
			console.log(capitalise(arg1), arg2);
		},
		warn: function(arg1, arg2) {
			console.log(capitalise(arg1), arg2);
		},
		debug: function(arg1, arg2) {
			console.log(capitalise(arg1), arg2);
		}
	}
}
