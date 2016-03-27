import es6Html from "./some-html.html";

function sanitizeHtml(html: string) {
	return html.toLowerCase();
}

export default sanitizeHtml(es6Html);
