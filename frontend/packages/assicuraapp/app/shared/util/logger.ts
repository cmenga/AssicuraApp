import { Logger } from "@site-builder/lib";

let log: Logger | null = null;

export function getLogger() {
  const developmentLog: "development" | "production"  = import.meta.env.VITE_ASSICURA_APP_PROD ? "production" : "development"; 
  if (log === null) {
    log = new Logger(developmentLog);
    log.setLevel("trace");
    log.debug("Logger settato");
  }
  return log;
}