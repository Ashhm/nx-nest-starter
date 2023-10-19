import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { KafkaContext, RedisContext } from '@nestjs/microservices';
import { Observable, tap } from 'rxjs';
import { HandlerWithResolver } from '../interfaces';

@Injectable()
export class EventCompletionInterceptor implements NestInterceptor {
  public async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    if (context.getType() !== 'rpc') {
      return next.handle();
    }
    const handler = context.getHandler() as HandlerWithResolver;
    const switchedContext = context.switchToRpc();
    const rpcContext: KafkaContext | RedisContext | unknown = switchedContext.getContext();
    if ((!this.isKafkaContext(rpcContext) && !this.isRedisContext(rpcContext)) || !handler.resolver) {
      return next.handle();
    }

    return next.handle().pipe(tap(() => handler.resolver()));
  }

  private isKafkaContext(maybeKafkaContext: unknown): maybeKafkaContext is KafkaContext {
    return maybeKafkaContext instanceof KafkaContext;
  }

  private isRedisContext(maybeRedisContext: unknown): maybeRedisContext is RedisContext {
    return maybeRedisContext instanceof RedisContext;
  }
}
