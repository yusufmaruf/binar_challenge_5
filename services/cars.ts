import { Express, Request, Response } from "express";
import { CarsRepository } from "../repositories/cars";
import { Cars } from "../models/cars";


export class CarsService {
  private carsRepository: CarsRepository;

  constructor() {
    this.carsRepository = new CarsRepository();
  }

  async getMany(res: Response): Promise<void> {
    const cars = await this.carsRepository.getMany();
    res.send(cars);
  }

async getOne(id: number): Promise<Cars | undefined> {
  const car = await this.carsRepository.getOne(id.toString());
  return car;
}

   async softDelete(id: number, adminId: number): Promise<void> {
  try {
    await this.carsRepository.softDelete(id.toString(), adminId);
    // You might want to send a response back to the controller or handle it as needed.
  } catch (error) {
    // Handle the error, for example, log it.
    console.error(error);
    throw new Error('Internal server error');
  }
 }
  

async create(carData: Cars): Promise<void> {
  try {
    const car = await this.carsRepository.create(carData);
    // You might want to send a response back to the controller or handle it as needed.
  } catch (error) {
    // Handle the error, for example, log it.
    console.error(error);
    throw new Error('Internal server error');
  }
}

async update(id: number, carData: Partial<Cars>): Promise<void> {
  try {
    await this.carsRepository.update(id.toString(), carData as Cars);
    // You might want to send a response back to the controller or handle it as needed.
  } catch (error) {
    // Handle the error, for example, log it.
    console.error(error);
    throw new Error('Internal server error');
  }
}

  
  async delete(id: number): Promise<void> {
  try {
    const result = await this.carsRepository.delete(id.toString());
    // You might want to send a response back to the controller or handle it as needed.
  } catch (error) {
    // Handle the error, for example, log it.
    console.error(error);
    throw new Error('Internal server error');
  }
}
async getFilteredCars(dateObject: Date | undefined, parsedCapacity: number | undefined): Promise<Cars[]> {
    try {
      const filteredCars = await this.carsRepository.getFilteredCars(dateObject, parsedCapacity);
      return filteredCars;
    } catch (error) {
      // Handle error as needed
      throw new Error('Internal server error in getFilteredCars');
    }
}
}
