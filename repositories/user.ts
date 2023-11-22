// user.repository.ts
import { UserModel, Users } from "../models/users";

export class UserRepository {
  static async findByEmail(email: string): Promise<Users | undefined> {
    return UserModel.query().findOne({ email: email.toLowerCase() });
  }

  static async createUser(name: string, email: string, password: string): Promise<Users> {
    return UserModel.query().insert({ name, email, password });
  }
}
