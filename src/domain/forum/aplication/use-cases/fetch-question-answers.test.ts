import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to list question answers', async () => {
    const student = await makeStudent({
      name: 'John Doe',
    })
    inMemoryStudentsRepository.items.push(student)

    const answer1 = await makeAnswer({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })

    const answer2 = await makeAnswer({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })

    const answer3 = await makeAnswer({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })

    await inMemoryAnswersRepository.create(answer1)
    await inMemoryAnswersRepository.create(answer2)
    await inMemoryAnswersRepository.create(answer3)

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(3)
    expect(result.value?.answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ author: 'John Doe', answerId: answer1.id }),
        expect.objectContaining({ author: 'John Doe', answerId: answer2.id }),
        expect.objectContaining({ author: 'John Doe', answerId: answer3.id }),
      ]),
    )
  })

  it('should be able to list paginated question answers', async () => {
    const student = await makeStudent({
      name: 'John Doe',
    })
    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        await makeAnswer({
          questionId: new UniqueEntityId('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(2)
    expect(result.value?.answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ author: 'John Doe' }),
        expect.objectContaining({ author: 'John Doe' }),
      ]),
    )
  })
})
