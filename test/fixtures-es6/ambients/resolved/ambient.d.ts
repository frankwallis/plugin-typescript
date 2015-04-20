interface IAmbient {
   hum();
}

declare module 'ambient' {
   export var music: IAmbient;
}
