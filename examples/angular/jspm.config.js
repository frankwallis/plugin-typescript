SystemJS.config({
  transpiler: "ts",
  typescriptOptions: {
    "module": "system",
    "noImplicitAny": false,
    "typeCheck": "strict",
    "tsconfig": "src/another-tsconfig.json"
  },
  packages: {
    "src": {
      "main": "index",
      "defaultExtension": "ts",
      "meta": {
        "*.css": {
          "loader": "css"
        },
        "*.ts": {
          "loader": "ts"
        }
      }
    }
  }
});