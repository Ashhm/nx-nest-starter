import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export interface TransportClientParams {
  clientToken: string;
  transport: Transport;
  options?: MicroserviceOptions;
}
