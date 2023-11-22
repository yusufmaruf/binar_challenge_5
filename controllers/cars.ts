import { Express, Request, Response } from "express";
import { CarsService } from "../services/cars";
import { Cars } from "../models/cars";
import { errorWrapper } from "../utils/errorwrapper";

interface IParams {
  id: string;
}

export  class CarsController {
  app: Express;
  service: CarsService;

  constructor(app: Express) {
    this.app = app;
    this.service = new CarsService();
  }

  init() {
    this.app.get("/cars", (req, res) => this.getMany(req, res));
    this.app.get("/cars/:id", (req, res) => this.getOne(req, res));
    this.app.post("/cars", (req, res) => this.create(req, res));
    this.app.patch("/cars/:id", (req, res) => this.update(req, res));
    this.app.delete("/cars/:id", (req, res) => this.del(req, res));
    this.app.get("/filtered-cars", (req, res) => this.getFilteredCars(req, res));
      
  }

  async getMany(_req: Request, res: Response) {
    const result = await errorWrapper(this.service.getMany(res));
    return res.status(result.status).json(result.data);
  }

 async getOne(req: Request, res: Response) {
  const id = +req.params.id;
  const car = await this.service.getOne(id);

  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }

  return res.status(200).json(car);
}


 async create(req: Request<{}, {}, Cars>, res: Response) {
  try {
    await this.service.create(req.body);
    return res.status(201).json({ message: 'Car created successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

  async update(req: Request<IParams, {}, Partial<Cars>>, res: Response) {
  try {
    const id = +req.params.id;
    const body = req.body;
    await this.service.update(id, body);
    return res.status(200).json({ success: true, result: body });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

 async del(req: Request<IParams>, res: Response) {
  try {
    const id = +req.params.id;
    await this.service.delete(id);
    return res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
    }
    async getFilteredCars(req: Request, res: Response) {
    try {
      const { date, capacity } = req.query;

      let dateObject: Date | undefined;
      if (date) {
        const dateString = String(date);
        dateObject = new Date(dateString);
        if (isNaN(dateObject.getTime())) {
          return res.status(400).json({ error: 'Invalid date format' });
        }
      }

      let parsedCapacity: number | undefined;
      if (capacity) {
        const capacityString = String(capacity);
        parsedCapacity = parseInt(capacityString, 10);
        if (isNaN(parsedCapacity)) {
          return res.status(400).json({ error: 'Invalid capacity format' });
        }
      }

      const filteredCars = await this.service.getFilteredCars(dateObject, parsedCapacity);
      res.status(200).json({ cars: filteredCars });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
