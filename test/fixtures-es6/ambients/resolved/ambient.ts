/// <reference path="./ambient.d.ts" />

class Jarre implements IAmbient {
   hum() {
      console.log("mmmMmmmMMmm")
   }
}

export var Music = new Jarre();
