import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../../src/domain/forum/aplication/repositories/question-comments-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const comments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return comments
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const comment = this.items.find((item) => item.id.toString() === id)

    if (!comment) return null

    return comment
  }

  async delete(comment: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === comment.id)

    this.items.splice(itemIndex, 1)
  }

  async create(comment: QuestionComment): Promise<void> {
    this.items.push(comment)
  }
}
