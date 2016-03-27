import es6Html from "./some-html.html";
import commonjsHtml = require("./some-html.html");

function sanitizeHtml(html: string) {
	return html.toLowerCase();
}

export var allHtml = sanitizeHtml(es6Html) + sanitizeHtml(commonjsHtml);
