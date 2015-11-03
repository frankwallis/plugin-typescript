System.config({
  baseURL: ".",
  defaultJSExtensions: true,
  transpiler: false,
  typescriptOptions: {
    "noImplicitAny": false,
    "typeCheck": true,
    "tsconfig": "src/another-tsconfig.json"
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  packages: {
    "src": {
      "main": "index",
      "defaultExtension": "ts",
      "meta": {
        "*.ts": {
          "loader": "ts"
        },
        "*.js": {
          "loader": "ts"
        },
        "*.css": {
          "loader": "css"
        }
      }
    }
  }
});
