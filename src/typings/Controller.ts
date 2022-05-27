import { NextFunction, Request, Response, Router } from "express";

export enum Methods {
  ALL = "all",
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
  OPTIONS = "options",
  HEAD = "head",
}

interface IRoute {
  path: string;
  method: Methods;
  handler?: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  localMiddleware?: ((
    req: Request,
    res: Response,
    next: NextFunction
  ) => void)[];
}

export default abstract class Controller {
  public router = Router();
  public abstract path: string;
  protected abstract readonly routes: Array<IRoute>;

  public setRoutes = (): Router => {
    for (const route of this.routes) {
      for (const mw of route.localMiddleware) {
        this.router.use(route.path, mw);
      }
      try {
        this.router[route.method](route.path, route.handler);
      } catch (err) {
        console.error(`💩 Method is not valid`);
      }
    }
    return this.router;
  };

  protected sendSuccess(
    res: Response,
    data: object,
    message?: string
  ): Response {
    return res.status(200).json({
      message: message || "success",
      data: data,
    });
  }

  protected sendError(res: Response, message?: string): Response {
    return res.status(500).json({
      message: message || "Internal server error",
    });
  }
}
