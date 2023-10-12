import { randomUUID } from 'crypto';
import { Inject } from '@nestjs/common';
import { getConfigToken } from '@nestjs/config';
import { Params as PinoParams } from 'nestjs-pino/params';
import { APP_CONFIG_TOKEN } from './app-config.constants';
import { configFactory } from './app-config.factory';

export class AppConfigService {
  constructor(
    @Inject(getConfigToken(APP_CONFIG_TOKEN))
    private readonly config: ReturnType<typeof configFactory>,
  ) {}

  get loggerSettings(): PinoParams {
    return {
      pinoHttp: {
        autoLogging: {
          ignore: (req) => /\/api\/health$/.test(req.url as string),
        },
        genReqId: function (req, res) {
          const existingRequestId = req.id ?? req.headers['x-request-id'];
          if (existingRequestId) {
            return existingRequestId;
          }
          const requestId = randomUUID();
          res.setHeader('X-Request-Id', requestId);
          return requestId;
        },
        redact: {
          paths: ['req.headers', 'res.headers', 'req.remoteAddress', 'req.remotePort'],
          remove: true,
        },
        level: this.config.loggerLevel,
        transport:
          this.config.loggerTransport === 'pretty'
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                },
              }
            : undefined,
      },
    };
  }

  get port() {
    return this.config.port;
  }
}
