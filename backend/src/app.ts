import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { VersioningType } from '@nestjs/common';
import { metricsMiddleware } from "./prom";

/**
 *
 */
export async function bootstrap() {
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule,{});
  app.use(helmet());
  app.enableCors();
  app.set("trust proxy", 1);
  app.use(metricsMiddleware);
  app.enableShutdownHooks();
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: "v",
  });
  const config = new DocumentBuilder()
    .setTitle("TURL")
    .setDescription("Tiny URL as a Service")
    .setVersion("1.0")
    .addTag("turl")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document);
  return app;
}
