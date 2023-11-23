// user.controller.ts
import { Express, Request, Response } from "express";
import { UserService } from "../services/userservices";
import { Users } from "../models/users";
import { authenticateToken, isfulladmin, isAdmin } from "../utils/auth";


export class UserController {
  app: Express;
  service: UserService;


  constructor(app: Express) {
    this.app = app;
    this.service = new UserService();
  }

  init() {
    this.app.post("/login", (req, res)=> this.login(req, res));
    this.app.post("/register", (req, res)=> this.register(req, res));
    this.app.post("/createadmin", authenticateToken, isAdmin,  (req, res)=> this.createadmin(req, res));
  }

   async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const token = await this.service.loginUser(email, password);
      if (token) {
        res.json({ token });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

   async register(req: Request<{}, {}, Users>, res: Response){

    try {
      const newUser = await this.service.registerUser(req.body);

      if (newUser) {
        res.status(201).json({ message: "User registered successfully", user: newUser });
      } else {
        res.status(400).json({ error: "Email already registered" });
      }
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
    
  }
    async createadmin(req: Request<{}, {}, Users>, res: Response) {

     try {
      req.body.role = "admin";
      const newUser = await this.service.registerUser(req.body);

      if (newUser) {
        res.status(201).json({ message: "User registered successfully", user: newUser });
      } else {
        res.status(400).json({ error: "Email already registered" });
      }
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
    
  }
}
