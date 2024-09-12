export class ConfigItem {
  constructor() {}



  toJSON() {
    const obj = this;
    const methodNames = Object.getOwnPropertyNames(obj).filter(
      function (property) {
        return typeof obj[property] == 'function';
      },
    );
    return {
      ...this,
      className: this.constructor.name,
      methodNames: methodNames,
    };
  }
}
