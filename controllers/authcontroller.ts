import { Express, Request, Response } from "express";
import { AuthService } from '../services/authService';
import { Users } from "../models/users";
import { errorWrapper } from "../utils/errorwrapper";

interface IParams {
  id: string;
}

export  class AuthController {
  app: Express;
  service: AuthService;

  constructor(app: Express) {
    this.app = app;
    this.service = new AuthService();
  }

  init() {
    this.app.get('/login', (req, res) => this.showLogin(req, res));
    this.app.post('/login', (req, res, next) => this.service.authenticate(req, res, next));
    this.app.get('/logout', (req, res) => this.logout(req, res));
  }
public showLogin(req: Request, res: Response) {
    res.render('login');
  }

  public logout(req: Request, res: Response) {
    req.logout((err) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Logout failed' });
      } else {
        res.status(200).json({ success: true, message: 'Logout successful' });
      }
    });
  }
}
