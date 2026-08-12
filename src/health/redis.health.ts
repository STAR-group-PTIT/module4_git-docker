import { Inject, Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {
    super();
  }

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    try {
      const reply = await this.redis.ping();
      const isHealthy = reply === 'PONG';
      return this.getStatus(key, isHealthy, { reply });
    } catch (error) {
      const result = this.getStatus(key, false, {
        error: (error as Error).message,
      });
      throw new HealthCheckError('Redis check failed', result);
    }
  }
}
