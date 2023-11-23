// user.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository, } from "../repositories/user";
import { Users } from "../models/users";
import { TOKEN_SECRET } from "../utils/auth";


export class UserService {
  static async loginUser(email: string, password: string): Promise<string | undefined> {
    const user = await UserRepository.findByEmail(email);
    console.log(user);

    if (!user) {
      return undefined; // User not found
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return undefined; // Wrong credentials
    }

    const token = jwt.sign({ email: user.email, id: user, role: user.role }, TOKEN_SECRET, {
      expiresIn: "1h",
    });

    return token;
  }

  static async registerUser(name: string, email: string, password: string): Promise<Users | undefined> {
    const existingUser = await UserRepository.findByEmail(email);

    if (existingUser) {
      return undefined; // Email already registered
    }

    return UserRepository.createUser(name, email, password);
  }
}
