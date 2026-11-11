export class Email {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || "";
    this.providerId = data.providerId || null;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      providerId: this.providerId,
    };
  }
}
