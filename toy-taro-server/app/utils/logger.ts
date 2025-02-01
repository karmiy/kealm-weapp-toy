export class Logger {
  private _tags: Set<string> = new Set();

  constructor(tags = new Set<string>()) {
    this._tags = new Set(tags);
  }

  static getLogger(tag: string): Logger {
    const instance = new Logger();
    instance._tags.add(tag);
    return instance;
  }

  tag(tag: string) {
    const newTags = new Set(this._tags);
    newTags.add(tag);
    return new Logger(newTags);
  }

  private _log(level: string, ...args: unknown[]): void {
    const tagString = this._tags.size > 0 ? `${[...this._tags].join("")}` : "";
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} [${level.toUpperCase()}]${tagString}`, ...args);
  }

  info = (...args: unknown[]) => {
    this._log("info", ...args);
  };

  error = (...args: unknown[]) => {
    this._log("error", ...args);
  };

  warning = (...args: unknown[]) => {
    this._log("warning", ...args);
  };
}
