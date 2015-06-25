System.config({
  "baseURL": ".",
  "defaultJSExtensions": true,
  "transpiler": "typescript",
  "typescriptOptions": {
    "noImplicitAny": false,
    "typeCheck": false
  },
  "paths": {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*",
    "app": "src"
  },
  "packages": {
    "app": {
      "main": "index",
      "defaultExtension": "ts",
      "meta": {
        "*.ts": {
          "loader": "ts"
        },
        "*.css": {
          "loader": "css"
        }
      }
    }
  }
});

System.config({
  "map": {
    "angular": "github:angular/bower-angular@1.4.1",
    "css": "github:systemjs/plugin-css@0.1.13",
    "ts": "github:frankwallis/plugin-typescript@2.0.0",
    "typescript": "github:mhegazy/typescript@v1.5-beta2",
    "github:frankwallis/plugin-typescript@2.0.0": {
      "typescript": "github:mhegazy/typescript@v1.5-beta2"
    }
  }
});

