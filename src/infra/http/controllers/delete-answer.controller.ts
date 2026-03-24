import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteAnswerUseCase } from '@/domain/forum/aplication/use-cases/delete-answer'

@ApiTags('Respostas')
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'ID inválido' })
@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Excluir resposta' })
  @ApiResponse({ status: 204, description: 'Resposta excluída com sucesso' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ) {
    const { sub: userId } = user

    const result = await this.deleteAnswer.execute({
      answerId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
