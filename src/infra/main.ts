import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  const config = new DocumentBuilder()
    .setTitle('Nest Clean API')
    .setDescription('API REST de um fórum de perguntas e respostas (Q&A)')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const envService = app.get(EnvService)
  const port = envService.get('PORT')

  await app.listen(port)
}

bootstrap()
