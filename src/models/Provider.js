export class Provider {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || "";
    this.address = data.address || "";
    this.logoUrl = data.logoUrl || "";
    this.active =
      data.active !== undefined ? Boolean(data.active) : true;
  }

  get isActive() {
    return this.active;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      logoUrl: this.logoUrl,
      active: this.active ? 1 : 0,
    };
  }
}