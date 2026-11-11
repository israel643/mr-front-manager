export class CriticalStock {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || "";
        this.description = data.description || "";
        this.stock = data.stock || 0;
    }
}