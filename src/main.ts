import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'", // Allow inline scripts
            'https://cdn.jsdelivr.net', // Allow scripts from jsDelivr CDN
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'", // Allow inline styles
            'https://cdn.jsdelivr.net', // Allow styles from jsDelivr CDN
          ],
          imgSrc: ["'self'", 'data:'],
        },
      },
    }),
  );
  // app.use(helmet());
  // app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS APIs')
    .setDescription('Documentation for NestJS APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('/api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(3000);
}
bootstrap();
