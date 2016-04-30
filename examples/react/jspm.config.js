SystemJS.config({
  transpiler: "ts",
  typescriptOptions: {
    "module": "system",
    "noImplicitAny": false,
    "typeCheck": "strict",
    "tsconfig": true
  },
  packages: {
    "src": {
      "main": "index.tsx",
      "defaultExtension": "tsx",
      "meta": {
        "*.css": {
          "loader": "css"
        }
      }
    }
  }
});
