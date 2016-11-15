SystemJS.config({
  transpiler: "ts",
  typescriptOptions: {
    "module": "system",
    "target": "es5",
    "typeCheck": true,
    "tsconfig": true,
    "sourceMap": true,
    "typings": {
      "@angular/core": "index.d.ts",
      "@angular/common": "index.d.ts",
      "@angular/compiler": "index.d.ts",
      "@angular/platform-browser": "index.d.ts",
      "@angular/platform-browser-dynamic": "index.d.ts",
      "rxjs": "Rx.d.ts"
    }
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
