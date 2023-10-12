export type MockConfig<D extends Record<string, unknown> = Record<string, unknown>> = {
  dataSets: D;
  mock: jest.Mock;
};
