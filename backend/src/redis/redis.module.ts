import {FactoryProvider, Module} from "@nestjs/common";

import {Redis} from "ioredis";

const redisConnectionFactory: FactoryProvider<Redis> = {
  provide: "REDIS",
  useFactory: () => {
    const redisInstance =  new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port:  6379,
      sentinels: [
        { host: process.env.REDIS_HOST || "localhost", port:  26379 }
      ],
    });
    redisInstance.on("connect", () => {
      console.log("Connected to Redis");
    });
    redisInstance.on("error", (err) => {
      throw new Error(`Error connecting to Redis: ${err}`);
    });
    return redisInstance;
  },
};
@Module({
  providers: [redisConnectionFactory],
  exports: ["REDIS"],
})
export class RedisModule {}
