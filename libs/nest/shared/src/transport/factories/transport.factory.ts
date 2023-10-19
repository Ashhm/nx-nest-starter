import { ClientsModule } from '@nestjs/microservices';
import { TransportConfigModule, TransportConfigService } from '../configs';
import { TransportClientParams } from '../interaces';

export class TransportFactory {
  public static createClients(params: TransportClientParams[]) {
    return ClientsModule.registerAsync(
      params.map((param) => ({
        name: param.clientToken,
        imports: [TransportConfigModule],
        inject: [TransportConfigService],
        useFactory: (configService: TransportConfigService) =>
          configService.createClientOptions(param.transport, param.clientToken, param.options),
      })),
    );
  }
}
