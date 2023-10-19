import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Jsonify } from 'type-fest';
import { REDIS_CLIENT_KEY } from '../constants';

@Injectable()
export class RedisClientService {
  constructor(@Inject(REDIS_CLIENT_KEY) private readonly redisClient: ClientProxy) {}

  public async send<R, T = unknown>(pattern: string, data: T): Promise<Jsonify<R>> {
    return lastValueFrom<Jsonify<R>>(this.redisClient.send(pattern, data));
  }

  public emit<T>(pattern: string, data: T): void {
    this.redisClient.emit<T>(pattern, data);
  }
}
