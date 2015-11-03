System.config({
  baseURL: ".",
  defaultJSExtensions: true,
  transpiler: false,
  typescriptOptions: {
    "noImplicitAny": false,
    "typeCheck": true,
    "tsconfig": true
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  packages: {
    "src": {
      "main": "index.tsx",
      "defaultExtension": "tsx",
      "meta": {
        "*.js": {
          "loader": "ts"
        },
        "*.jsx": {
          "loader": "ts"
        },
        "*.ts": {
          "loader": "ts"
        },
        "*.tsx": {
          "loader": "ts"
        },
        "*.css": {
          "loader": "css"
        }
      }
    }
  }
});
