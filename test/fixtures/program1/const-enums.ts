/// <reference path="../_references.d.ts" />

function decide() {
	var today = new Date();

	if (today.getDate() % 2 == 0)
		return decisions.Either.Yes;
	else
		return decisions.Either.No;
}
