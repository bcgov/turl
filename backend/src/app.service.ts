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

  async postURLShorten(url: string): Promise<string> {
    const shortURLFromRedis = await this.redis.get(url);
    if(shortURLFromRedis) {
      return shortURLFromRedis;
    }
    const { nanoid } = await import('nanoid');
    const shortURL = nanoid(12);
    return new Promise((resolve, reject) => {
      this.redis.multi()
        .set(shortURL, url)
        .set(url, shortURL).
        exec((err, result) => {
          if(err) {
            reject(err);
          } else {
            resolve(shortURL);
          }
        });
    });
  }

  async getURL(url: string) {
    return this.redis.get(url);
  }
}
