System.register(["typescript"], function(exports_1) {
    var ts;
    var typescriptRegex, javascriptRegex, mapRegex, declarationRegex, htmlRegex;
    function isAbsolute(filename) {
        return (filename[0] == '/');
    }
    exports_1("isAbsolute", isAbsolute);
    function isRelative(filename) {
        return (filename[0] == '.');
    }
    exports_1("isRelative", isRelative);
    function isAmbientImport(filename) {
        return (isAmbient(filename) && !isTypescriptDeclaration(filename));
    }
    exports_1("isAmbientImport", isAmbientImport);
    function isAmbientReference(filename) {
        return (isAmbient(filename) && isTypescriptDeclaration(filename));
    }
    exports_1("isAmbientReference", isAmbientReference);
    function isAmbient(filename) {
        return (!isRelative(filename) && !isAbsolute(filename));
    }
    exports_1("isAmbient", isAmbient);
    function isTypescript(filename) {
        return typescriptRegex.test(filename);
    }
    exports_1("isTypescript", isTypescript);
    function isJavaScript(filename) {
        return javascriptRegex.test(filename);
    }
    exports_1("isJavaScript", isJavaScript);
    function isSourceMap(filename) {
        return mapRegex.test(filename);
    }
    exports_1("isSourceMap", isSourceMap);
    function isTypescriptDeclaration(filename) {
        return declarationRegex.test(filename);
    }
    exports_1("isTypescriptDeclaration", isTypescriptDeclaration);
    function isHtml(filename) {
        return htmlRegex.test(filename);
    }
    exports_1("isHtml", isHtml);
    function tsToJs(tsFile) {
        return tsFile.replace(typescriptRegex, '.js');
    }
    exports_1("tsToJs", tsToJs);
    function tsToJsMap(tsFile) {
        return tsFile.replace(typescriptRegex, '.js.map');
    }
    exports_1("tsToJsMap", tsToJsMap);
    function jsToDts(jsFile) {
        return jsFile.replace(javascriptRegex, '.d.ts');
    }
    exports_1("jsToDts", jsToDts);
    function stripDoubleExtension(normalized) {
        var parts = normalized.split('.');
        if (parts.length > 1) {
            var extensions = ["js", "jsx", "ts", "tsx", "json"];
            if (extensions.indexOf(parts[parts.length - 2]) >= 0) {
                return parts.slice(0, -1).join('.');
            }
        }
        return normalized;
    }
    exports_1("stripDoubleExtension", stripDoubleExtension);
    function hasError(diags) {
        return diags.some(function (diag) { return (diag.category === ts.DiagnosticCategory.Error); });
    }
    exports_1("hasError", hasError);
    return {
        setters:[
            function (ts_1) {
                ts = ts_1;
            }],
        execute: function() {
            typescriptRegex = /\.tsx?$/i;
            javascriptRegex = /\.js$/i;
            mapRegex = /\.map$/i;
            declarationRegex = /\.d\.tsx?$/i;
            htmlRegex = /\.html$/i;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOlsiaXNBYnNvbHV0ZSIsImlzUmVsYXRpdmUiLCJpc0FtYmllbnRJbXBvcnQiLCJpc0FtYmllbnRSZWZlcmVuY2UiLCJpc0FtYmllbnQiLCJpc1R5cGVzY3JpcHQiLCJpc0phdmFTY3JpcHQiLCJpc1NvdXJjZU1hcCIsImlzVHlwZXNjcmlwdERlY2xhcmF0aW9uIiwiaXNIdG1sIiwidHNUb0pzIiwidHNUb0pzTWFwIiwianNUb0R0cyIsInN0cmlwRG91YmxlRXh0ZW5zaW9uIiwiaGFzRXJyb3IiXSwibWFwcGluZ3MiOiI7O1FBdUJNLGVBQWUsRUFLZixlQUFlLEVBS2YsUUFBUSxFQUtSLGdCQUFnQixFQUtoQixTQUFTO0lBeENmLG9CQUEyQixRQUFnQjtRQUMxQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7SUFDN0JBLENBQUNBO0lBRkQsbUNBRUMsQ0FBQTtJQUVELG9CQUEyQixRQUFnQjtRQUMxQ0MsTUFBTUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7SUFDN0JBLENBQUNBO0lBRkQsbUNBRUMsQ0FBQTtJQUVELHlCQUFnQyxRQUFnQjtRQUMvQ0MsTUFBTUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsdUJBQXVCQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNwRUEsQ0FBQ0E7SUFGRCw2Q0FFQyxDQUFBO0lBRUQsNEJBQW1DLFFBQWdCO1FBQ2xEQyxNQUFNQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSx1QkFBdUJBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO0lBQ25FQSxDQUFDQTtJQUZELG1EQUVDLENB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LENBQUNBLENBQUFBO0lBQzdFQSxDQUFDQTtJQUZELCtCQUVDLENBQUE7Ozs7Ozs7WUFwREssZUFBZSxHQUFHLFVBQVUsQ0FBQztZQUs3QixlQUFlLEdBQUcsUUFBUSxDQUFDO1lBSzNCLFFBQVEsR0FBRyxTQUFTLENBQUM7WUFLckIsZ0JBQWdCLEdBQUcsYUFBYSxDQUFDO1lBS2pDLFNBQVMsR0FBRyxVQUFVLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAqL1xyXG5pbXBvcnQgKiBhcyB0cyBmcm9tIFwidHlwZXNjcmlwdFwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQWJzb2x1dGUoZmlsZW5hbWU6IHN0cmluZykge1xyXG5cdHJldHVybiAoZmlsZW5hbWVbMF0gPT0gJy8nKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVsYXRpdmUoZmlsZW5hbWU6IHN0cmluZykge1xyXG5cdHJldHVybiAoZmlsZW5hbWVbMF0gPT0gJy4nKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQW1iaWVudEltcG9ydChmaWxlbmFtZTogc3RyaW5nKSB7XHJcblx0cmV0dXJuIChpc0FtYmllbnQoZmlsZW5hbWUpICYmICFpc1R5cGVzY3JpcHREZWNsYXJhdGlvbihmaWxlbmFtZSkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNBbWJpZW50UmVmZXJlbmNlKGZpbGVuYW1lOiBzdHJpbmcpIHtcclxuXHRyZXR1cm4gKGlzQW1iaWVudChmaWxlbmFtZSkgJiYgaXNUeXBlc2NyaXB0RGVjbGFyYXRpb24oZmlsZW5hbWUpKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQW1iaWVudChmaWxlbmFtZTogc3RyaW5nKSB7XHJcblx0cmV0dXJuICghaXNSZWxhdGl2ZShmaWxlbmFtZSkgJiYgIWlzQWJzb2x1dGUoZmlsZW5hbWUpKTtcclxufVxyXG5cclxuY29uc3QgdHlwZXNjcmlwdFJlZ2V4ID0gL1xcLnRzeD8kL2k7XHJcbmV4cG9ydCBmdW5jdGlvbiBpc1R5cGVzY3JpcHQoZmlsZW5hbWU6IHN0cmluZykge1xyXG5cdHJldHVybiB0eXBlc2NyaXB0UmVnZXgudGVzdChmaWxlbmFtZSk7XHJcbn1cclxuXHJcbmNvbnN0IGphdmFzY3JpcHRSZWdleCA9IC9cXC5qcyQvaTtcclxuZXhwb3J0IGZ1bmN0aW9uIGlzSmF2YVNjcmlwdChmaWxlbmFtZTogc3RyaW5nKSB7XHJcblx0cmV0dXJuIGphdmFzY3JpcHRSZWdleC50ZXN0KGZpbGVuYW1lKTtcclxufVxyXG5cclxuY29uc3QgbWFwUmVnZXggPSAvXFwubWFwJC9pO1xyXG5leHBvcnQgZnVuY3Rpb24gaXNTb3VyY2VNYXAoZmlsZW5hbWU6IHN0cmluZykge1xyXG5cdHJldHVybiBtYXBSZWdleC50ZXN0KGZpbGVuYW1lKTtcclxufVxyXG5cclxuY29uc3QgZGVjbGFyYXRpb25SZWdleCA9IC9cXC5kXFwudHN4PyQvaTtcclxuZXhwb3J0IGZ1bmN0aW9uIGlzVHlwZXNjcmlwdERlY2xhcmF0aW9uKGZpbGVuYW1lOiBzdHJpbmcpIHtcclxuXHRyZXR1cm4gZGVjbGFyYXRpb25SZWdleC50ZXN0KGZpbGVuYW1lKTtcclxufVxyXG5cclxuY29uc3QgaHRtbFJlZ2V4ID0gL1xcLmh0bWwkL2k7XHJcbmV4cG9ydCBmdW5jdGlvbiBpc0h0bWwoZmlsZW5hbWU6IHN0cmluZykge1xyXG5cdHJldHVybiBodG1sUmVnZXgudGVzdChmaWxlbmFtZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0c1RvSnModHNGaWxlOiBzdHJpbmcpIHtcclxuXHRyZXR1cm4gdHNGaWxlLnJlcGxhY2UodHlwZXNjcmlwdFJlZ2V4LCAnLmpzJyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0c1RvSnNNYXAodHNGaWxlOiBzdHJpbmcpIHtcclxuXHRyZXR1cm4gdHNGaWxlLnJlcGxhY2UodHlwZXNjcmlwdFJlZ2V4LCAnLmpzLm1hcCcpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24ganNUb0R0cyhqc0ZpbGU6IHN0cmluZykge1xyXG5cdCByZXR1cm4ganNGaWxlLnJlcGxhY2UoamF2YXNjcmlwdFJlZ2V4LCAnLmQudHMnKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN0cmlwRG91YmxlRXh0ZW5zaW9uKG5vcm1hbGl6ZWQ6IHN0cmluZykge1xyXG5cdGNvbnN0IHBhcnRzID0gbm9ybWFsaXplZC5zcGxpdCgnLicpO1xyXG5cclxuXHRpZiAocGFydHMubGVuZ3RoID4gMSkge1xyXG5cdFx0Y29uc3QgZXh0ZW5zaW9ucyA9IFsgXCJqc1wiLCBcImpzeFwiLCBcInRzXCIsIFwidHN4XCIsIFwianNvblwiIF07XHJcblxyXG5cdFx0aWYgKGV4dGVuc2lvbnMuaW5kZXhPZihwYXJ0c1twYXJ0cy5sZW5ndGggLTJdKSA+PSAwKSB7XHJcblx0XHRcdHJldHVybiBwYXJ0cy5zbGljZSgwLCAtMSkuam9pbignLicpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gbm9ybWFsaXplZDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGhhc0Vycm9yKGRpYWdzOiBBcnJheTx0cy5EaWFnbm9zdGljPik6IGJvb2xlYW4ge1xyXG4gICByZXR1cm4gZGlhZ3Muc29tZShkaWFnID0+IChkaWFnLmNhdGVnb3J5ID09PSB0cy5EaWFnbm9zdGljQ2F0ZWdvcnkuRXJyb3IpKVxyXG59Il19