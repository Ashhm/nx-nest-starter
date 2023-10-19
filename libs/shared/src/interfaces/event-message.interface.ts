export interface EventMessage<D> {
  metadata: {
    requestId: string;
    timestamp: Date;
  };
  data?: D;
}
