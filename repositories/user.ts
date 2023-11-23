// user.repository.ts
import { UserModel, Users } from "../models/users";

export class UserRepository {
   async findByEmail(email: string): Promise<Users | undefined> {
    return UserModel.query().findOne({ email: email.toLowerCase() });
    
  }

   async createUser(userData: Users): Promise<Users> {
    const body = {
      ...userData,
    };
    const user = await UserModel.query().insert(body).returning("*");
    return user;
  }
}
