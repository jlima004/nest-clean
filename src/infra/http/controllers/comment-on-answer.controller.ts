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
import { CommentOnAnswerUseCase } from '@/domain/forum/aplication/use-cases/comment-on-answer'

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
})
type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema)

@ApiTags('Comentários')
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Dados inválidos' })
@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Comentar em uma resposta' })
  @ApiResponse({ status: 201, description: 'Comentário criado com sucesso' })
  async handle(
    @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const { content } = body
    const { sub: userId } = user

    const result = await this.commentOnAnswer.execute({
      content,
      answerId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
