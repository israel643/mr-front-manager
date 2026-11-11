export class WithoutRotation {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || "";
        this.description = data.description || "";
        this.stock = data.stock || 0;
        this.lastSale = data.lastSale || null;
    }
}