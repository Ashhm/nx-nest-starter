import { AppError } from './app-error.interface';

export interface RpcMessage<D> {
  metadata: {
    requestId: string;
    correlationId: string;
    replyTo?: string;
    timestamp: Date;
  };
  data?: D;
  error?: AppError;
}
