interface IAmbient {
   hum();
}

declare module 'ambient' {
   export var Music: IAmbient;
}
