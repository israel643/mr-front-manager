import { Role } from "./Role";

export class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || "";
    this.lastName = data.lastName || "";
    this.email = data.email || "";
    this.password = data.password || "";
    this.photoUrl = data.photoUrl || "";
    this.roleId = data.roleId || null;
    this.active =
      data.active !== undefined ? Boolean(data.active) : true;
    this.role = data.role ? new Role(data.role) : null;
  }

  get fullName() {
    return `${this.name} ${this.lastName}`;
  }

  get isActive() {
    return this.active;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      last_name: this.lastName,
      email: this.email,
      password: this.password,
      photo_url: this.photoUrl,
      rol_id: this.rolId,
      ind_active: this.indActive ? 1 : 0,
    };
  }
}
