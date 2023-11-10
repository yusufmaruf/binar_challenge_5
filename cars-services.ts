import { Express, Response, Request } from "express";
import { CarsModel, Cars } from "./models/cars";
import { spec } from "node:test/reporters";
import  multer  from "multer";



export class CarsService {
  app: Express;

  constructor(app: Express) {
    this.app = app;
  }

  init() {
    this.app.get("/car", this.getMany);
    this.app.get("/", this.index);
    this.app.get("/cars", this.cars);
    this.app.get("/carsfiltered", this.getFilteredCars);
    this.app.post("/car", this.create);
    this.app.get("/car/:id", this.getOne);
    this.app.patch("/car/:id", this.patch);
    this.app.delete("/car/:id", this.delete);
  }

  async getMany(_: Request, res: Response) {
    const cars = await CarsModel.query();
    res.send(cars);
  }


 async getFilteredCars(req: Request, res: Response) {
  try {
    // Get data from the request body
    const { date, capacity } = req.query;
    console.log(await date);
    console.log(await capacity);


    // Create a query builder
    let query = CarsModel.query();
    console.log((await query).length + "Length awal");
    

    // Apply filtering based on the criteria
     if (date) {
      // Cast 'date' to a string
      const dateString = String(date);
       const dateObject = new Date(dateString);
       console.log(dateObject);
      if (!isNaN(dateObject.getTime())) {
        query = query.where('availableAt', '<=', dateObject);
      } else {
        res.status(400).json({ error: 'Invalid date format' });
        return;
      }
    }
    console.log((await query).length + "date");

    if (capacity) {
      // Cast 'capacity' to a string, then parse it as an integer
      const capacityString = String(capacity);
      const parsedCapacity = parseInt(capacityString, 10);

      if (!isNaN(parsedCapacity)) {
        query.where('capacity', '>=', parsedCapacity);
      } else {
        res.status(400).json({ error: 'Invalid capacity format' });
        return;
      }
    }
    console.log((await query).length + "capacity");

    // Execute the query
    const filteredCars = await query;
    const cars = filteredCars;

    // Send the filtered cars as a response
    res.render('cars', { cars });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}


  async index(_: Request, res: Response) {
    res.render('index');
  }
  async cars(_: Request, res: Response) {
    const cars = await CarsModel.query();
    res.render('cars',{cars});
  }


  async getOne(req: Request, res: Response) {
    const cars = await CarsModel.query().findById(req.params.id);
    res.send(cars);
  }

  async create(req: Request<{}, {}, Cars, {}>, res: Response) {
    const body = {
      ...req.body,
      specs: JSON.stringify(req.body.specs),
      options: JSON.stringify(req.body.specs),
    };
    const car = await CarsModel.query().insert(body).returning("*");
    res.send(car);
  }

  async patch(req: Request, res: Response) {
    const body = {
      ...req.body,
      specs: JSON.stringify(req.body.specs),
      options: JSON.stringify(req.body.specs),
    };
    const car = await CarsModel.query().findById(req.params.id).patch(body);
    res.status(200).json({'success' : true, 'result': car})
  }
  

  async delete(req: Request, res: Response) {
  try {
    const car = await CarsModel.query().deleteById(req.params.id);
    if (car > 0) {
      res.status(200).json({ message: "Car deleted successfully" });
    } else {
      res.status(404).json({ message: "Car not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting car"});
  }
}
}
