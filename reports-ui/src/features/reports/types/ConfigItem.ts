export class ConfigItem {
  id?: string;
  constructor() {}

  toJSON() {
    const obj = this;
    const methodNames = [];
    for (let key in obj) {
      if (typeof obj[key] == 'function') {
        methodNames.push(key);
      }
    }

    return {
      ...this,
      className: this.constructor.name,
      methodNames: methodNames,
    };
  }

  setIds(rootId: string) {
    ConfigItem.setIdsLevel(this, rootId);
  }

  private static setIdsLevel(struct, path = '') {
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
