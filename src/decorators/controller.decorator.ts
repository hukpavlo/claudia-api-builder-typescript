import 'reflect-metadata';

import { ClassMetadata } from '../models';
import { CLASS_METADATA_KEY } from '../const';

export const Controller = (baseRoutePath: string): ClassDecorator => (targetClass) => {
  const metadata: ClassMetadata = Reflect.getOwnMetadata(CLASS_METADATA_KEY, targetClass.prototype) || {};

  if (metadata.baseRoutePath) {
    throw new Error(`Class "${targetClass.name}" must have only one controller.`);
  }

  metadata.baseRoutePath = baseRoutePath;

  Reflect.defineMetadata(CLASS_METADATA_KEY, metadata, targetClass.prototype);
};
