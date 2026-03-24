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
import { FetchQuestionCommentsUseCase } from '@/domain/forum/aplication/use-cases/fetch-question-comments'
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Comentários')
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Parâmetros inválidos' })
@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Listar comentários de uma pergunta' })
  @ApiResponse({ status: 200, description: 'Lista de comentários retornada com sucesso' })
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionComments.execute({
      page,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { comments } = result.value

    return {
      comments: comments.map(CommentWithAuthorPresenter.toHTTP),
    }
  }
}
