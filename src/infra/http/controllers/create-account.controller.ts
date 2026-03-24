import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ApiTags, ApiOperation, ApiResponse, ApiConflictResponse, ApiBadRequestResponse } from '@nestjs/swagger'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { RegisterStudentUseCase } from '@/domain/forum/aplication/use-cases/register-student'
import { StudentAlreadyExistsError } from '@/domain/forum/aplication/use-cases/errors/student-already-exists-error'
import { Public } from '@/infra/auth/public'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@ApiTags('Contas')
@ApiBadRequestResponse({ description: 'Dados inválidos' })
@ApiConflictResponse({ description: 'Email já cadastrado' })
@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Criar nova conta de usuário' })
  @ApiResponse({ status: 201, description: 'Conta criada com sucesso' })
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
