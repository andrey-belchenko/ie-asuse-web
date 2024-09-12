export class ConfigItem {
  id?: string;
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

  setIds(rootId: string) {
    this.setIdsLevel(this, rootId);
  }

  private setIdsLevel(struct, path = '') {
    if (typeof struct === 'object' && !Array.isArray(struct)) {
      if (struct instanceof ConfigItem) {
        struct.id = path;
        configItemDict[struct.id] = struct;
      }
      for (let key in struct) {
        this.setIdsLevel(struct[key], `${path}.${key}`);
      }
    } else if (Array.isArray(struct)) {
      struct.forEach((item, index) => {
        this.setIdsLevel(item, `${path}.${index}`);
      });
    }
  }
}

export const configItemDict: { [key: string]: ConfigItem } = {};
