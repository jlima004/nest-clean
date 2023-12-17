import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/aplication/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const comments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return comments
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const comment = this.items.find((item) => item.id.toString() === id)

    if (!comment) return null

    return comment
  }

  async create(comment: AnswerComment): Promise<void> {
    this.items.push(comment)
  }

  async delete(comment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === comment.id)

    this.items.splice(itemIndex, 1)
  }
}
