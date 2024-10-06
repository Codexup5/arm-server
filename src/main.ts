import { NestFactory } from '@nestjs/core';

import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { VersioningType } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from 'app/app.module';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, { cors: true });

    app.setGlobalPrefix('api/v1');

    const config = new DocumentBuilder()
        .setTitle('ArmServer')
        .setVersion('1.0')
        .addTag('arm-server')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1', app, document);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: ['', 'v1'],
        prefix: '',
    });

    await app.listen(5000);
}
bootstrap();
