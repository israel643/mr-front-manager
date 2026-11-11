export class Phone {
  constructor(data = {}) {
    this.id = data.id || null;
    this.phone = data.phone || "";
    this.providerId = data.providerId || null;
  }

  toJSON() {
    return {
      id: this.id,
      phone: this.phone,
      providerId: this.providerId,
    };
  }
}