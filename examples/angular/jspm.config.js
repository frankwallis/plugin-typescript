SystemJS.config({
  transpiler: "ts",
  typescriptOptions: {
    "module": "system",
    "noImplicitAny": false,
    "typeCheck": "strict",
    "tsconfig": "src/another-tsconfig.json",
    "attypes": [
      "angular",
      "jquery"
    ]
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
