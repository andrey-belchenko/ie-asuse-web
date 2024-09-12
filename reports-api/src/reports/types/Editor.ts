export interface EditorProps {}

export class Editor {
  constructor(props: EditorProps) {}

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
