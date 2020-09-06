import 'reflect-metadata';
import ApiBuilder, { Handler } from 'claudia-api-builder';

import { CLASS_METADATA_KEY } from '../const';
import { ClassMetadata, MethodMetadata, Middleware } from '../models';

export abstract class BaseApi {
  private _apiBuilder: ApiBuilder;

  constructor() {
    this._apiBuilder = new ApiBuilder();
    this.addControllers(this.getControllers());
  }

  public get apiBuilder(): ApiBuilder {
    return this._apiBuilder;
  }

  protected addControllers(controllers: any[]): void {
    for (const controller of controllers) {
      const prototype = Object.getPrototypeOf(controller);
      const classMetadata: ClassMetadata = Reflect.getOwnMetadata(CLASS_METADATA_KEY, prototype);

      if (!classMetadata) {
        throw new Error(`Class "${prototype.constructor.name}" is not a controller.`);
      }

      for (const property of Object.getOwnPropertyNames(prototype)) {
        const methodMetadata: MethodMetadata = Reflect.getOwnMetadata(property, prototype);

        if (!methodMetadata) continue;

        for (const route of methodMetadata.routes) {
          this._apiBuilder[route.method](
            this.getRoutePath(classMetadata.baseRoutePath, route.path),
            this.createMainHandler(methodMetadata.middlewares, controller[property]),
          );
        }
      }
    }
  }

  private createMainHandler(middlewares: Middleware[], controller: Handler): Handler {
    const mainHandler: Handler = async (req) => {
      for (const middleware of middlewares) {
        //just for AsyncMiddlewares decorator
        if (Array.isArray(middleware)) {
          await Promise.all(middleware.map((m) => m(req)));
        } else {
          await middleware(req);
        }
      }

      return controller(req);
    };

    return mainHandler;
  }

  private getRoutePath(baseRoutePath: string, path: string): string {
    return (baseRoutePath !== '/' ? baseRoutePath : '') + path;
  }

  protected abstract getControllers(): any[];
}
