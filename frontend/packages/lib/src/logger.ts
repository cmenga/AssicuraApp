type EnvMode = "development" | "production";
type LogLovel = "trace" | "debug" | "info" | "warn" | "error" | "silent";

const weight: Record<LogLovel, number> = {
  trace: 0, debug: 10, info: 20, warn: 30, error: 40, silent: 50
};

export class Logger {
  private id: number = Math.random() * Math.PI;
  private level: LogLovel = "silent";
  private env: EnvMode;
  private styles: Record<string, string> = {
    debug: "color: #6c757d; font-weight: normal",      // grigio chiaro
    info: "color: #0d6efd; font-weight: 600",         // blu
    warn: "color: #d97706; font-weight: 700",         // arancione
    error: "color: #dc3545; font-weight: 700",         // rosso
  };

  constructor(env: EnvMode = "development") {
    this.env = env;
  }

  setLevel(level: LogLovel) {
    this.level = level;
  }

  private shouldLog(level: LogLovel): boolean {
    if (this.env === "production") {
      return false;
    } else if (weight[level] < weight[this.level]) {
      return false;
    }
    return true;
  }

  private formatExtra(extra: Record<string, any>[]) {
    return extra.map(obj => Object.entries(obj)
      .map(([key, val]) => `${key}=${JSON.stringify(val)}`)
      .join(", ")
    ).join(" | ");
  }

  debug(msg: any, ...extra: Record<string, any>[]) {
    if (!this.shouldLog("debug")) return;
    console.log(`%c[DEBUG ${new Date().toISOString()}]%c ${msg}`, this.styles.debug, "", this.formatExtra(extra));
  }

  info(msg: any, ...extra: Record<string, any>[]) {
    if (!this.shouldLog("info")) return;
    console.log(`%c[INFO ${new Date().toISOString()}]%c ${msg}`, this.styles.info, "", this.formatExtra(extra));
  }

  warn(msg: any, ...extra: Record<string, any>[]) {
    if (!this.shouldLog("warn")) return;
    console.warn(`%c[WARN ${new Date().toISOString()}]%c ${msg}`, this.styles.warn, "", this.formatExtra(extra));
  }

  error(msg: any, ...extra: Record<string, any>[]) {
    if (!this.shouldLog("error")) return;
    console.error(`%c[ERROR ${new Date().toISOString()}]%c ${msg}`, this.styles.error, "", this.formatExtra(extra));
  }

  toString() {
    return `Logger: ${this.id}\nLog level: ${this.level}\nEnv Mode: ${this.env}\n`;
  }
}
