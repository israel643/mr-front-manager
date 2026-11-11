import { Article } from "./Article";

export class MovementItem {
  constructor(data = {}) {
    this.id = data.id || null;
    this.movementId = data.movementId || null;
    this.articleId = data.articleId || null;
    this.quantity = data.quantity || 0;
    this.price = data.price || 0.0;
    this.subtotal = data.subtotal || 0.0;
    this.article = data.article ? new Article(data.article) : null;
  }

  toJSON() {
    return {
      id: this.id,
      movementId: this.movementId,
      articleId: this.articleId,
      quantity: this.quantity,
      price: this.price,
      subtotal: this.subtotal,
    };
  }
}
