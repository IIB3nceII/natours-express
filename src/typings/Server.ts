import { Application, RequestHandler } from "express";
import http from "http";
import Controller from "./Controller";

export default class Server {
  private app: Application;
  private readonly port: number;

  /**
   * constructor
   */
  constructor(app: Application, port: number) {
    this.app = app;
    this.port = port;
  }

  public run(): http.Server {
    return this.app.listen(this.port, () => {
      console.log(`🚀 App listen on http://localhost:${this.port}`);
    });
  }

  public loadMiddleware(middlewares: Array<RequestHandler>): void {
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  public loadControllers(controllers: Array<Controller>): void {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.setRoutes());
    });
  }
}
