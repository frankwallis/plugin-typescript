System.config({
  baseURL: ".",
  defaultJSExtensions: true,
  transpiler: "traceur",
  typescriptOptions: {
    "noImplicitAny": false,
    "typeCheck": true,
    "resolveAmbientRefs": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  },
  paths: {
    "example-view": "./src/example-view.html",
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*",
    "app": "src"
  },

  packages: {
    "app": {
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
