import express, { Express, Response, Request, NextFunction } from "express";
import knex, { Knex } from "knex";
import { Model } from "objection";
import { CarsController } from "./controllers/cars";
import cors from 'cors';
import { UserController } from "./controllers/authcontroller";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";



const app: Express = express();
const PORT = 3000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.urlencoded({ extended: true }));



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
    new UserController(this.app).init();

  }
}

new App(app).app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
