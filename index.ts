import express, { Express } from "express";
import knex from "knex";
import { Model } from "objection";
import { CarsService } from "./cars-services";
import * as config from "./knexfile";
import apirouter from './router/home';
import bodyParser from "body-parser";



const PORT = 3000;
const ENV = "development";
// @ts-expect-error
const knexInstance = knex(config[ENV]);

// Connect ORM to Database
Model.knex(knexInstance);

const app: Express = express();
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

// app.use(apirouter);
// Register Cars Service
new CarsService(app).init();

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
