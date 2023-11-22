import express, { Express, Response, Request, NextFunction } from "express";
import knex, { Knex } from "knex";
import { Model } from "objection";
import { CarsController } from "./controllers/cars";
import cors from 'cors';
import { UserController } from "./controllers/authcontroller";

import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "./utils/auth";

const app: Express = express();
const PORT = 3000;

// Connect ORM to Database
const knexInstance = knex({
    client: "postgresql",
    connection: {
      database: "car",
      user: "postgres",
      password: "bismillah",
    },
  });

  Model.knex(knexInstance);

  app.use(cors());
  app.use(express.json()); // Use express.json() for JSON parsing

// the type of req.user must be provided




class App {
  app: Express;

  constructor(app: Express) {
    this.app = app;

    this.routes();
  }

  routes() {
    new CarsController(this.app).init();
    app.post("/login", UserController.login);
    app.post("/register", UserController.register);
    // app.get("/car", authenticateToken, (req, res) => Carscontroller.getMany(req, res)); 
    // this.app.post("/login", async (req: Request<{}, {}, Omit<Users, "id">>, res: Response) => {
    //   const { email, password } = req.body;
    //   console.log(email, password);

    //   try {
    //     // Get the user
    //     const user = await UserModel.query().findOne({ email: email.toLowerCase() });

    //     // If there is no user, return an error
    //     if (!user) {
    //       return res.status(404).json({ message: "User not found" });
    //     }

    //     // Check if the password is correct
    //     const isPasswordValid = await bcrypt.compare(password, user.password);

    //     if (!isPasswordValid) {
    //       return res.status(400).json({ message: "Wrong credentials" });
    //     }

    //     // Generate and send the token
    //     const token = jwt.sign({ email: user.email, id: user.id }, TOKEN_SECRET, {
    //       expiresIn: "1h", // token will expire in one hour
    //     });
    //     return res.json({ token });
    //   } catch (error) {
    //     // Handle other errors
    //     console.error(error);
    //     return res.status(500).json({ message: "Internal Server Error" });
    //   }
    // });

    // this.app.post('/register', async (req, res) => {
    //   const { name, email, password } = req.body;
    //   console.log(name, email, password);

    //   try {
    //     // Check if email is already registered
    //     const existingUser = await UserModel.query().findOne({ email });

    //     if (existingUser) {
    //       return res.status(400).json({ error: 'Email already registered' });
    //     }
    //     console.log(name, email, password);

    //     // Create a new user
    //     const newUser = await UserModel.query().insert({ name, email, password });

    //     res.status(201).json({ message: 'User registered successfully', user: newUser });
    //   } catch (error) {
    //     console.error('Error registering user:', error);
    //     res.status(500).json({ error: 'Internal Server Error' });
    //   }
    // });
  }
}

new App(app).app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
