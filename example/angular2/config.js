System.config({
  baseURL: ".",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  typescriptOptions: {
    "module": "es6",
    "target": "es6",
    "typeCheck": true,
    "tsconfig": true,
    "sourceMap": true,
    "supportHtmlImports": true
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
        "*.css": {
          "loader": "css"
        },
        "*.html": {
          "loader": "text"
        }
      }
    },
    "example-service": {
      "main": "index",
      "defaultExtension": "ts",
      "meta": {
        "*.ts": {
          "loader": "ts"
        }
      }
    },
    "angular2": {
      "meta": {
        "*.js": {
          "typings": true
        }
      }
    },
    "rxjs": {
      "meta": {
        "*.js": {
          "typings": true
        }
      }
    }
  }
});
