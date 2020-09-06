import 'reflect-metadata';
import { Handler } from 'claudia-api-builder';

import { MethodMetadata } from '../models';

export const Middlewares = (middlewares: Handler | Handler[]): MethodDecorator => (targetMethod, propertyKey) => {
  const metadata: MethodMetadata = Reflect.getOwnMetadata(propertyKey, targetMethod) || { middlewares: [], routes: [] };

  metadata.middlewares.unshift(...(Array.isArray(middlewares) ? middlewares : [middlewares]));

  Reflect.defineMetadata(propertyKey, metadata, targetMethod);
};

export const AsyncMiddlewares = (middlewares: Handler | Handler[]): MethodDecorator => (targetMethod, propertyKey) => {
  const metadata: MethodMetadata = Reflect.getOwnMetadata(propertyKey, targetMethod) || { middlewares: [], routes: [] };

  metadata.middlewares.unshift(Array.isArray(middlewares) ? middlewares : [middlewares]);

  Reflect.defineMetadata(propertyKey, metadata, targetMethod);
};
