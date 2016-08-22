SystemJS.config({
  transpiler: "ts",
  typescriptOptions: {
    "module": "system",
    "noImplicitAny": false,
    "typeCheck": "strict",
    "tsconfig": true,
    "types": [
      "react",
      "react-dom"
    ]
  },
  packages: {
    "src": {
      "main": "index.tsx",
      "defaultExtension": "tsx",
      "meta": {
        "*.css": {
          "loader": "css"
        },
        "*.tsx": {
          "loader": "ts"
        }
      }
    }
  }
});
