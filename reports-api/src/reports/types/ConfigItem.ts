
export class ConfigItem {
  constructor() {}

  get className(): string {
    return this.constructor.name;
  }

  toJSON() {
    return {
      ...this,
      className: this.className
    };
  }
}
