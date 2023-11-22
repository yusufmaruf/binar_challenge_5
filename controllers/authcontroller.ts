// user.controller.ts
import { Request, Response } from "express";
import { UserService } from "../services/userservices";

export class UserController {
  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const token = await UserService.loginUser(email, password);

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

  static async register(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;

    try {
      const newUser = await UserService.registerUser(name, email, password);

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
