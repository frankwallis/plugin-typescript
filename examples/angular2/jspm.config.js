SystemJS.config({
  transpiler: "ts",
  typescriptOptions: {
    "module": "system",
    "target": "es5",
    "tsconfig": true,
    "sourceMap": true
  },
  packages: {
    "src": {
      "main": "index",
      "defaultExtension": "ts",
      "meta": {
        "*.css": {
          "loader": "css"
        },
        "*.html": {
          "loader": "text"
        }
      }
    }
  }
});
