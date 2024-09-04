import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {AppModule} from './app.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import helmet from 'helmet';
import {metricsMiddleware} from "./prom";

/**
 *
 */
export async function bootstrap() {
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule, {});
  app.use(helmet());
  app.enableCors();
  app.set("trust proxy", 1);
  app.use(metricsMiddleware);
  app.enableShutdownHooks();
  const tinyURLDescription = `### What is TURL? 
    TURL(Tiny URL) is a URL shortening service that allows users to shorten long URLs into short URLs. It is a simple and easy-to-use service that can be used to shorten URLs for sharing in emails, or in any other situation where a long URL is not ideal.`;



  const config = new DocumentBuilder()
    .setTitle("TURL")
    .setDescription(tinyURLDescription)
    .setContact(
      "NRIDS Architects & FDS Devops",
      "",
      ""
    )
    .addServer(process.env.APP_URL || "http://localhost:3000/")
    .addBearerAuth()
    .addTag("turl")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document);
  return app;
}
