// services/authService.ts

import { UserRepository } from '../repositories/user';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Users } from '../models/users';
import { errorWrapper } from '../utils/errorwrapper';

const userRepository = new UserRepository();

export class AuthService {
  constructor() {
    this.initPassport();
  }

  private initPassport() {
    passport.use(
      new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
          const user = await userRepository.getOne(email);

          if (!user) {
            return done(null, false, { message: 'User not found' });
          }

          const isValidPassword = await bcrypt.compare(password, user.password);

          if (!isValidPassword) {
            return done(null, false, { message: 'Invalid password' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      })
    );
  }

  public authenticate(req: any, res: any, next: any): void {
    passport.authenticate('local', async (err: any, user: any, info: any) => {
      try {
        if (err) {
          return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        if (!user) {
          return res.status(401).json({ success: false, message: info.message });
        }

        await errorWrapper(this.login(req, user));

        return res.status(200).json({ success: true, message: 'Login successful' });
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
    })(req, res, next);
  }

  private async login(req: any, user: Users): Promise<void> {
    return new Promise((resolve, reject) => {
      req.logIn(user, (loginErr: any) => {
        if (loginErr) {
          reject(loginErr);
        } else {
          resolve();
        }
      });
    });
  }

  public ensureAuthenticated(req: any, res: any, next: any): void {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
}
