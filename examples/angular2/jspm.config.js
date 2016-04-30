SystemJS.config({
  transpiler: "plugin-babel",
  typescriptOptions: {
    "module": "es6",
    "target": "es6",
    "typeCheck": "strict",
    "tsconfig": true,
    "sourceMap": true,
    "removeComments": false,
    "supportHtmlImports": true
  },
  packages: {
    "src": {
      "main": "index",
      "defaultExtension": "ts",
      "meta": {
        "*.ts": {
          "loader": "ts"
        },
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
