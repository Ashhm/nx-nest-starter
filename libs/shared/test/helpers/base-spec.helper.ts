import { randomUUID } from 'crypto';

export class BaseSpecHelper<Ctx = object> {
  public mixins: Set<new () => unknown>;

  private contexts = new Map<string, Ctx>();

  /**
   * Allows to run initialization phase on every mixin
   */
  public init(...args: unknown[]) {
    if (this.mixins) {
      this.mixins.forEach((MixinCtor) => {
        if ('init' in MixinCtor.prototype && typeof MixinCtor.prototype.init === 'function') {
          MixinCtor.prototype.init.apply(this, args);
        }
      });
    }
  }

  public createContext(): [string, Ctx] {
    const context = {} as Ctx;
    const contextId = randomUUID();
    this.contexts.set(contextId, context);
    return [contextId, context];
  }

  public getContext(contextId: string) {
    const context = this.contexts.get(contextId);
    if (!context) {
      throw new Error('Context not found');
    }
    return context;
  }

  public deleteContext(contextId: string) {
    this.contexts.delete(contextId);
  }

  public createPromiseWithResolver(onResolve = () => undefined) {
    let resolver: (value: unknown) => void = onResolve;
    const promise = new Promise((resolve) => {
      resolver = resolve;
    });
    return { resolver, promise };
  }
}
