import { ValidationPipe } from "@nestjs/common";
import serverlessExpress from "@codegenie/serverless-express";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DatabaseInterceptor } from "./interceptors/database.interceptor";
import { HttpExceptionFilter } from "./interceptors/filters/http-exception";

let server;

async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule, {
    logger: ["error", "warn"],
  });
  nestApp.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  // Pipes
  nestApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  nestApp.useGlobalInterceptors(new DatabaseInterceptor());
  nestApp.useGlobalFilters(new HttpExceptionFilter());

  await nestApp.init();

  const expressApp = nestApp.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler = async (event, context, callback) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
