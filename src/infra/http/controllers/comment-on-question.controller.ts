import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { z } from 'zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CommentOnQuestionUseCase } from '@/domain/forum/aplication/use-cases/comment-on-question'

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
})
type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema)

@ApiTags('Comentários')
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Dados inválidos' })
@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Comentar em uma pergunta' })
  @ApiResponse({ status: 201, description: 'Comentário criado com sucesso' })
  async handle(
    @Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body
    const { sub: userId } = user

    const result = await this.commentOnQuestion.execute({
      content,
      questionId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
