import { Category } from "./Category";
import { Brand } from "./Brand";
import { Measurement } from "./Measurement";

export class Article {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || "";
    this.description = data.description || "";
    this.categoryId = data.categoryId || null;
    this.brandId = data.brandId || null;
    this.measurementId = data.measurementId || null;
    this.purchasePrice = data.purchasePrice || 0.0;
    this.salePrice = data.salePrice || 0.0;
    this.stock = data.stock || 0;
    this.imageUrl = data.imageUrl || "";
    this.active = data.active !== undefined ? Boolean(data.active) : true;
    this.category = data.category ? new Category(data.category) : null;
    this.brand = data.brand ? new Brand(data.brand) : null;
    this.measurement = data.measurement
      ? new Measurement(data.measurement)
      : null;
  }
}
