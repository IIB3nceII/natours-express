import express, { Request, Response, Router } from "express";
import fs from "fs";

export class TourRoutes {
  private tours = JSON.parse(
    fs
      .readFileSync(`${process.cwd()}/dev-data/data/tours-simple.json`)
      .toString()
  );

  constructor(private _router: Router) {
    // this.initRoutes();
  }

  public initRoutes() {
    this._router.route("/api/v1/users").get(this.getAllTours).post(this.createTour);
    this._router
      .route("/api/v1/users/:id")
      .get(this.getTour)
      .patch(this.updateTour)
      .delete(this.deleteTour);
  }

  private getAllTours = (req: Request, res: Response): void => {
    res.status(200).json({ data: { tours: this.tours } });
  };

  private getTour = (req: Request, res: Response): Response | void => {
    const id = +req.params.id;
    const tour = this.tours.find((t) => t.id === id);

    if (!tour) {
      return res.status(404).json({ message: "💩 Nope" });
    }

    res.status(200).json({ data: { tour } });
  };

  private createTour = (req: Request, res: Response): void => {
    const newId = this.tours[this.tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    this.tours.push(newTour);

    fs.writeFile(
      `${process.cwd()}/dev-data/data/tours-simple.json`,
      JSON.stringify(this.tours),
      (err) => {
        res.status(201).json({ data: { tour: newTour } });
      }
    );
  };

  private updateTour = (req: Request, res: Response): Response | void => {
    if (+req.params.id > this.tours.length) {
      return res.status(404).json({ message: "💩 Tour not found" });
    }

    res.status(200).json({ data: { tour: "" } });
  };

  private deleteTour = (req: Request, res: Response): Response | void => {
    if (+req.params.id > this.tours.length) {
      return res.status(404).json({ message: "💩 Tour not found" });
    }

    res.status(204).json({ data: null });
  };
}
