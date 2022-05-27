import express, {
  Application,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import fs from "fs";
import Server from "./typings/Server";
import { HTTP_PORT } from "./config/config";
import Controller from "./typings/Controller";
import morgan from "morgan";

const app: Application = express();
app.use(express.json());

const server: Server = new Server(app, HTTP_PORT);

const controllers: Array<Controller> = [];

const globalMiddlewares: Array<RequestHandler> = [morgan("combined")];

const tours = JSON.parse(
  fs.readFileSync(`${process.cwd()}/dev-data/data/tours-simple.json`).toString()
);

const getAllTours = (req: Request, res: Response): void => {
  res.status(200).json({ data: { tours } });
};

const getTour = (req: Request, res: Response): Response | void => {
  const id = +req.params.id;
  const tour = tours.find((t) => t.id === id);

  if (!tour) {
    return res.status(404).json({ message: "💩 Nope" });
  }

  res.status(200).json({ data: { tour } });
};

const createTour = (req: Request, res: Response): void => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${process.cwd()}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ data: { tour: newTour } });
    }
  );
};

const updateTour = (req: Request, res: Response): Response | void => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({ message: "💩 Tour not found" });
  }

  res.status(200).json({ data: { tour: "" } });
};

const deleteTour = (req: Request, res: Response): Response | void => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({ message: "💩 Tour not found" });
  }

  res.status(204).json({ data: null });
};

app.route("/api/tours").get(getAllTours).post(createTour);
app.route("/api/tours/:id").get(getTour).patch(updateTour).delete(deleteTour);

Promise.resolve().then(() => {
  server.loadMiddleware(globalMiddlewares);
  server.loadControllers(controllers);
  server.run();
});
