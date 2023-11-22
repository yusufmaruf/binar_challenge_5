import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Users, UserModel } from '../models/users';
import { UserRepository } from '../repositories/user';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(email: string, password: string): Promise<Users> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepository.create({ email, password: hashedPassword });
  }

  async login(email: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
      return token;
    }

    return null;
  }
}
