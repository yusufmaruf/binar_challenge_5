import express, { Express, Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import knex from "knex";
import { Model } from "objection";
import bcrypt from "bcryptjs";

import { CarsController } from "./controllers/cars";
import { AuthController } from "./controllers/authcontroller";
import { Users, UserModel } from "./models/users";
import passport from 'passport';
import session from 'express-session';





declare namespace Express {
  export interface Request {
    user?: Users;
  }
}



// Connect ORM to Database
const app: Express = express();
const PORT = 3000;
const TOKEN_SECRET = "hallo";
app.use(express.json());


function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Leave the Bearer

  if (!token) {
    return res.sendStatus(401).json({ message: "Invalid Token" });
  }

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403).json({ message: "Forbidden" });
    }

    req.user = user;
    next();
  });
}



app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    // Get the user, if there is no user throw error not found
    const user = await UserModel.query().findOne({
        email: email,
      })
      .throwIfNotFound();
    // Check if the password is correct
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email, id: user.id }, TOKEN_SECRET, {
        expiresIn: "1h", // token will expire in one hour
      });
      return res.json({ token });
    }

    return res.status(400).json({ message: "Wrong credentials" });
  } catch (error) {
    // Handle other errors
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


class App {
  app: Express;
  constructor(app: Express) {
    const knexInstance = knex({
      client: "postgresql",
      connection: {
        database: "car",
        user: "postgres",
        password: "bismillah",
      },
    });

    Model.knex(knexInstance);

    this.app = app;

    this.app.use(express.json());
    this.app.set("view engine", "ejs");

    this.routes();
  }

  routes() {
    // Insert routes here
    new CarsController(app).init();
    new AuthController(app).init();
  }
}

new App(app).app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});