import { HttpMethod } from '../const';
import { Handler } from 'claudia-api-builder';

export type ClassMetadata = {
  baseRoutePath: string;
};

export type RouteTypeDecorator = (routePath?: string) => MethodDecorator;

type Route = {
  path: string;
  method: HttpMethod;
};

export type Middleware = Handler | Handler[]

export type MethodMetadata = {
  routes: Route[];
  middlewares: Middleware[];
};
