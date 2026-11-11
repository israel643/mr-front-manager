import { MovementType } from "./MovementType";
import { User } from "./User";

export class Movement {
  constructor(data = {}) {
    this.id = data.id || null;
    this.movementTypeId = data.movementTypeId || null;
    this.userId = data.userId || null;
    this.total = data.total || null;
    this.createdAt = data.createdAt || null;
    this.movementType = data.movementType
      ? new MovementType(data.movementType)
      : null;
    this.user = data.user ? new User(data.user) : null;
  }

  toJSON() {
    return {
      id: this.id,
      movementTypeId: this.movementTypeId,
      userId: this.userId,
      total: this.total,
      createdAt: this.createdAt,
    };
  }
}
