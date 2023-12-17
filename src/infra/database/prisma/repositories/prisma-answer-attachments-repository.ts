import { Injectable } from '@nestjs/common'

import { AnswerAttachmentsRepository } from '@/domain/forum/aplication/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    throw new Error('Method not implemented.')
  }

  deleteManyByAnswerId(answerId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}