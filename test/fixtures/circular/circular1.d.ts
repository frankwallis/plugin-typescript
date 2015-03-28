/// <reference path="./circular2.d.ts" />

declare module circular1 {
   interface Sun extends circular2.Star {
      eclipse(deg: number);
   }
}
