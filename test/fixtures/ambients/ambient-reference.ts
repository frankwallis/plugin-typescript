/// <reference path="ambient.d.ts" />

import Enigma = require("./module1/ambient-references2");

class Enya implements IAmbient {
   hum() {
      console.log("mmmMmmmMMmm")
   }
}

class AmbientRoom {
   private acts: Array<IAmbient> = [];

   constructor() {
      this.acts.push(new Enigma());
      this.acts.push(new Enya());
   }
}

export = AmbientRoom;
