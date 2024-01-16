import { Module } from '@nestjs/common'

import { OnAnswerCreated } from '@/domain/notification/aplication/subscribers/on-answer-created'
import { OnQuestionBestAnswerChosen } from '@/domain/notification/aplication/subscribers/on-question-best-answer-chosen'
import { SendNotificationUseCase } from '@/domain/notification/aplication/use-cases/send-notification'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnAnswerCreated,
    OnQuestionBestAnswerChosen,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
