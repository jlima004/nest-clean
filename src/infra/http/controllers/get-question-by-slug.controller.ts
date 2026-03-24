import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger'

import { GetQuestionBySlugUseCase } from '@/domain/forum/aplication/use-cases/get-question-by-slug'
import { QuestionDetailsPresenter } from '../presenters/question-details-presenter'

@ApiTags('Perguntas')
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Slug inválido' })
@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Obter pergunta pelo slug' })
  @ApiResponse({ status: 200, description: 'Pergunta retornada com sucesso' })
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlug.execute({
      slug,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { question } = result.value

    return {
      question: QuestionDetailsPresenter.toHTTP(question),
    }
  }
}
