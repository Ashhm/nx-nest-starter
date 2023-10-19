export function buildMessagePatternProxy<T extends object>(messagePatterns: T): T {
  const namespace = process.env['NAMESPACE'] || process.env['NX_TASK_TARGET_PROJECT'];
  const isTestEnv = process.env['NODE_ENV'] === 'test';
  return new Proxy<T>(messagePatterns, {
    get(target, propertyKey, receiver) {
      const value = Reflect.get(target, propertyKey, receiver);
      if (isTestEnv && typeof value === 'string') {
        return namespace ? `${namespace}.${value}` : value;
      }
      return buildMessagePatternProxy(value as T);
    },
  });
}
