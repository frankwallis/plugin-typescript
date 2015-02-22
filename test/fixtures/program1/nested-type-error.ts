import mod = require("./one-import");
if (mod.a && mod.b)
  throw new Error();
