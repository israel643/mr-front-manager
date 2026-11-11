export class MovementType {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || "";
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
