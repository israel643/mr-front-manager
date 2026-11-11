export class BestSellingItem {
    constructor(data = {}) {
        this.articleId = data.articleId || null;
        this.name = data.name || "";
        this.imageUrl = data.imageUrl || "";
        this.amountSold = data.amountSold || null;
    }
}