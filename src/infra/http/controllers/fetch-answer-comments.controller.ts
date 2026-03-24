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
import { FetchAnswerCommentsUseCase } from '@/domain/forum/aplication/use-cases/fetch-answer-comments'
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
@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Listar comentários de uma resposta' })
  @ApiResponse({ status: 200, description: 'Lista de comentários retornada com sucesso' })
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.fetchAnswerComments.execute({
      page,
      answerId,
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
