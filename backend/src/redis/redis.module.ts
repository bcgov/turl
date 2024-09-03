import {FactoryProvider, Module} from "@nestjs/common";

import {Redis} from "ioredis";

const redisConnectionFactory: FactoryProvider<Redis> = {
  provide: "REDIS",
  useFactory: () => {
    const redisInstance =  new Redis({
      sentinels: [
        { host: process.env.REDIS_HOST || "localhost", port:  26379 }
      ],
      name: "mymaster",

    });
    redisInstance.on("connect", () => {
      console.log("Connected to Redis");
    });
    redisInstance.on("error", (err) => {
      console.error(`Error connecting to Redis: ${err}`);
    });
    redisInstance.on("reconnect", () => {
     console.log("reconnected");
    });

    return redisInstance;
  },
};
@Module({
  providers: [redisConnectionFactory],
  exports: ["REDIS"],
})
export class RedisModule {}
