import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerWithAuthor } from '../../enterprise/entities/value-objects/answer-with-author'

export abstract class AnswersRepository {
  abstract create(answer: Answer): Promise<void>
  abstract save(answer: Answer): Promise<void>
  abstract delete(answer: Answer): Promise<void>
  abstract findById(id: string): Promise<Answer | null>

  abstract findManyByQuestion(
    params: PaginationParams,
    questionId: string,
  ): Promise<Answer[]>

  abstract findManyByQuestionWithAuthor(
    params: PaginationParams,
    questionId: string,
  ): Promise<AnswerWithAuthor[]>
}
