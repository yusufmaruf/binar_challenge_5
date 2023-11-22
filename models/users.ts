import { ModelObject } from "objection";
import { ModelWithValidator } from "./base";

export class UserModel extends ModelWithValidator {
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  role!: 'admin' | 'superadmin' | 'user';

  static get tableName() {
    return "users";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        name: { type: "string", minLength: 5, maxLength: 255 },
        email: { type: "string", minLength: 5, maxLength: 255 },
        password: { type: "string", minLength: 8 },
        role: { type: "string", enum: ["admin", "superadmin","user"], default: "user" },
      },
    };
  }
}

export type Users = ModelObject<UserModel>;
