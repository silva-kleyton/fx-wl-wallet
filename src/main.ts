import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DatabaseInterceptor } from "./interceptors/database.interceptor";
import { HttpExceptionFilter } from "./interceptors/filters/http-exception";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // whitelist: false,
      // forbidNonWhitelisted: false,
    }),
  );

  app.useGlobalInterceptors(new DatabaseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle("Wallet API")
    .setDescription("The wallet API description")
    .setVersion("1.0")
    .addTag("wallet")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(process.env.PORT).then(() => {
    console.log("Application is running on port: " + process.env.PORT);
  });
}
bootstrap();
