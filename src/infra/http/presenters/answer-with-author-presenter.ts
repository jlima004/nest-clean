import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author'

export class AnswerWithAuthorPresenter {
  static toHTTP(answer: AnswerWithAuthor) {
    return {
      answerId: answer.answerId.toString(),
      authorId: answer.authorId.toString(),
      authorName: answer.author,
      content: answer.content,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
