export interface HandlerWithResolver {
  (...args: unknown[]): unknown;

  resolver: (value?: unknown) => void;
}
