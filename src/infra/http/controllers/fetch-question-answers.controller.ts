import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/aplication/use-cases/fetch-question-answers'
import { AnswerWithAuthorPresenter } from '../presenters/answer-with-author-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Respostas')
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Parâmetros inválidos' })
@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Listar respostas de uma pergunta' })
  @ApiResponse({ status: 200, description: 'Lista de respostas retornada com sucesso' })
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionAnswers.execute({
      page,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { answers } = result.value

    return {
      answers: answers.map(AnswerWithAuthorPresenter.toHTTP),
    }
  }
}
