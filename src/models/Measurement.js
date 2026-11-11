export class Measurement {
    constructor(data = {}) {
      this.id = data.id || null;
      this.name = data.name || "";
      this.abbreviation = data.abbreviation || "";
      this.active = data.active !== undefined ? Boolean(data.active) : true;
    }
  
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        abbreviation: this.abbreviation,
        active: this.active,
      };
    }
  }