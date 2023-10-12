import { UnionToIntersection } from 'type-fest';

export function applyMixins<T extends new () => InstanceType<T>, M extends Array<new () => InstanceType<M[number]>>>(
  baseCtor: T,
  mixinCtors: M,
) {
  mixinCtors.forEach((ctor) => {
    Object.getOwnPropertyNames(ctor.prototype).forEach((name) => {
      // Don't override base class property
      if (Object.getOwnPropertyDescriptor(baseCtor.prototype, name)) {
        return;
      }
      Object.defineProperty(
        baseCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(ctor.prototype, name) || Object.create(null),
      );
    });
  });
  return baseCtor as (new () => UnionToIntersection<InstanceType<M[number]> & InstanceType<T>>) & T;
}
