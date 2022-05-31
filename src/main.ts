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
import { TourRoutes, UserRoutes } from "./routes";

const app: Application = express();
const router = express.Router();
app.use(express.json());

const server: Server = new Server(app, HTTP_PORT);

const controllers: Array<Controller> = [];

const globalMiddlewares: Array<RequestHandler> = [morgan("combined")];

const tempToursRouter =  new TourRoutes(router);
app.use("/", tempToursRouter);

Promise.resolve().then(() => {
  // new UserRoutes();
  server.loadMiddleware(globalMiddlewares);
  server.loadControllers(controllers);
  server.run();
});
