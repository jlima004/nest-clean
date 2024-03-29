import { AnswersRepository } from '../repositories/answers-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { AnswerWithAuthor } from '../../enterprise/entities/value-objects/answer-with-author'

interface FetchQuestionAnswersUseCaseRequest {
  page: number
  questionId: string
}

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: AnswerWithAuthor[]
  }
>

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionWithAuthor(
      { page },
      questionId,
    )

    return right({ answers })
  }
}
