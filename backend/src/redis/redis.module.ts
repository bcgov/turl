import {FactoryProvider, Logger, Module} from "@nestjs/common";

import {Redis} from "ioredis";
import * as process from "node:process";
const redisLogger = new Logger("REDIS");

const redisConnectionFactory: FactoryProvider<Redis> = {
  provide: "REDIS",
  useFactory: () => {
    let redisInstance: Redis;
    if (process.env.NODE_ENV === "local") {
      redisInstance = new Redis();
    } else {
      redisInstance = new Redis({
        sentinels: [
          {host: process.env.REDIS_HOST || "localhost", port: 26379}
        ],
        name: "mymaster",
      });
    }
    redisInstance.on("connect", () => {
      redisLogger.log("Connected to Redis");
    });
    redisInstance.on("error", (err) => {
      redisLogger.error(`Error connecting to Redis: ${err}`);
    });
    redisInstance.on("reconnect", () => {
      redisLogger.log("reconnected");
    });

    return redisInstance;
  },
};

@Module({
  providers: [redisConnectionFactory],
  exports: ["REDIS"],
})
export class RedisModule {
}
