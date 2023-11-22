import { Users, UserModel } from "../models/users";

export class UserRepository {
 
    async getOne(email: string): Promise<Users | undefined> {
        return await UserModel.query().findOne({ email });
    }
  
}
