import "dotenv/config";
import {MiddlewareConsumer, Module, RequestMethod} from "@nestjs/common";
import {HTTPLoggerMiddleware} from "./middleware/req.res.logger";
import {ConfigModule} from "@nestjs/config";
import {AppService} from "./app.service";
import {AppController} from "./app.controller";
import {MetricsController} from "./metrics.controller";
import {TerminusModule} from '@nestjs/terminus';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TerminusModule,
  ],
  controllers: [AppController, MetricsController],
  providers: [AppService]
})
export class AppModule { // let's add a middleware on all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HTTPLoggerMiddleware).exclude({path: 'metrics', method: RequestMethod.ALL}, {
      path: 'health',
      method: RequestMethod.ALL
    }).forRoutes('*');
  }
}
