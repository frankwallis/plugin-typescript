import commonjsHtml = require("./some-html.html");

function sanitizeHtml(html: string) {
	return html.toLowerCase();
}

export default sanitizeHtml(commonjsHtml);
