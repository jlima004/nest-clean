import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/aplication/use-cases/chose-question-best-answer'

@ApiTags('Respostas')
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'ID inválido' })
@Controller('/answers/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerController {
  constructor(
    private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  @ApiOperation({ summary: 'Selecionar resposta como melhor resposta' })
  @ApiResponse({ status: 204, description: 'Melhor resposta selecionada com sucesso' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const { sub: userId } = user

    const result = await this.chooseQuestionBestAnswer.execute({
      answerId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
