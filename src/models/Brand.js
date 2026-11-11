export class Brand {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || "";
    this.logoUrl = data.logoUrl || "";
    this.active = data.active !== undefined ? Boolean(data.active) : true;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      logoUrl: this.logoUrl,
      active: this.active,
    };
  }
}
