/* */
type LoggerOptions = {
   debug?: boolean;
}

class Logger {
   constructor(private options: LoggerOptions) {
      this.options = options || {};
   }

   public log(msg: string) {
      console.log("TypeScript", "[Info]", msg);
   }

   public error(msg: string) {
      console.error("TypeScript", "[Error]", msg);
   }

   public warn(msg: string) {
      console.warn("TypeScript", "[Warning]", msg);
   }

   public debug(msg: string) {
      if (this.options.debug) {
         console.log("TypeScript", msg);
      }
   }
}

export default Logger;
