export class CartEntryItem {
    constructor(data = {}) {
        this.articleId = data.id || null;
        this.name = data.name || null;
        this.description = data.description || null;
        this.quantity = data.quantity || 0;
        this.price = data.purchasePrice || 0.00;
    }
    
    toJSON() {
        return {
            articleId: this.articleId,
            quantity: this.quantity,
            price: this.price,
        }
    }
}