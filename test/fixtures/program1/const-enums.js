/// <reference path="../_references.d.ts" />

function decide() {
    var today = new Date();
    if (today.getDate() % 2 == 0)
        return 1 /* Yes */;
    else
        return 2 /* No */;
}
