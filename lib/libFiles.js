System.register(["typescript"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ts;
    var libOption, libToFileNameMap, DEFAULT_LIB_FILE, DEFAULT_LIB_NAME, LIB_NAME_REGEX;
    function getDefaultLibFilePaths(options) {
        if (options.noLib) {
            return [];
        }
        if (options.lib) {
            return options.lib.map(function (lib) { return [libReference(lib), fileFromLibFolder(libToFileNameMap[lib])]; });
        }
        else {
            var libFileName = ts.getDefaultLibFileName(options);
            var libRef = void 0;
            if (libFileName === DEFAULT_LIB_FILE) {
                libRef = libReference("lib");
            }
            else {
                libRef = libReference(libFileName.match(LIB_NAME_REGEX)[1]);
            }
            return [[libRef, fileFromLibFolder(libFileName)]];
        }
    }
    exports_1("getDefaultLibFilePaths", getDefaultLibFilePaths);
    function libReference(libName) {
        return "typescript/lib/" + libName;
    }
    function fileFromLibFolder(fileName) {
        return "typescript/lib/" + fileName;
    }
    return {
        setters:[
            function (ts_1) {
                ts = ts_1;
            }],
        execute: function() {
            libOption = ts.optionDeclarations.find(function (x) { return x.name === "lib"; });
            libToFileNameMap = libOption.element.type;
            DEFAULT_LIB_FILE = "lib.d.ts";
            DEFAULT_LIB_NAME = "lib";
            LIB_NAME_REGEX = /lib\.(.*)\.d\.ts/;
            ;
        }
    }
});
