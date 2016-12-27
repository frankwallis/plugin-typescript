/// <reference path="./html-cjs.d.ts" />

import commonjsHtml = require("./some-html.html");

function sanitizeHtml(html: string) {
	return html.toLowerCase();
}

export default sanitizeHtml(commonjsHtml);
