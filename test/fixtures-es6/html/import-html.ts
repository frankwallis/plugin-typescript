import a from "./some-html.html";

function sanitizeHtml(html: string) {
	return html.toLowerCase();
}

export var b = sanitizeHtml(a);
