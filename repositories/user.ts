import { Users, UserModel } from '../models/users';

export class UserRepository {
  async findByEmail(email: string): Promise<Users | undefined> {
    return UserModel.query().where('email', email).first();
  }

  async create(user: Partial<Users>): Promise<Users> {
    return UserModel.query().insert(user);
  }
}
