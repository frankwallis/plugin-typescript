/// <reference path="resolved/ambient/ambient.d.ts" />

class Enya implements IAmbient {
   hum() {
      console.log("mmmMmmmMMmm")
   }
}

class AmbientRoom {
   private acts: Array<IAmbient> = [];

   constructor() {
      this.acts.push(new Enya());
   }
}

export default AmbientRoom;
