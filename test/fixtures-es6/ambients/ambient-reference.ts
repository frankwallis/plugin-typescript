/// <reference path="ambient/ambient.d.ts" />

import {Enigma} from "./ambient-consumer";

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

export default AmbientRoom;
