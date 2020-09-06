import 'reflect-metadata';

import { HttpMethod } from '../const';
import { MethodMetadata, RouteTypeDecorator } from '../models';

const createRouteTypeDecorator = (method: HttpMethod): RouteTypeDecorator => {
  return (path = ''): MethodDecorator => (targetMethod, propertyKey) => {
    const metadata: MethodMetadata = Reflect.getOwnMetadata(propertyKey, targetMethod) || { routes: [], middlewares: [] };

    metadata.routes.push({ path, method });

    Reflect.defineMetadata(propertyKey, metadata, targetMethod);
  };
};

export const Get = createRouteTypeDecorator(HttpMethod.GET);
export const Put = createRouteTypeDecorator(HttpMethod.PUT);
export const Any = createRouteTypeDecorator(HttpMethod.ANY);
export const Head = createRouteTypeDecorator(HttpMethod.HEAD);
export const Post = createRouteTypeDecorator(HttpMethod.POST);
export const Patch = createRouteTypeDecorator(HttpMethod.PATCH);
export const Delete = createRouteTypeDecorator(HttpMethod.DELETE);
