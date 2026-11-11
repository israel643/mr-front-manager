export class Role {
    constructor(data = {}) {
      this.id = data.id || null
      this.name = data.name || ''
    }
  }