export class Category {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || "";
    this.active = data.active !== undefined ? Boolean(data.active) : true;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      active: this.active,
    };
  }
}
