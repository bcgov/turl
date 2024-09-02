import {Inject, Injectable, OnModuleDestroy} from "@nestjs/common";
import {Redis} from "ioredis";

@Injectable()
export class AppService implements OnModuleDestroy{
  constructor(@Inject("REDIS") private readonly redis: Redis) {
  }
  onModuleDestroy(): any {
    this.redis.disconnect();
  }

  async getHello(): Promise<string> {
    return this.redis.ping();
  }
}
