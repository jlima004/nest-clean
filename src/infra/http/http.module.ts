import { Module } from '@nestjs/common'

import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/aplication/use-cases/create-question'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/aplication/use-cases/fetch-recent-questions'
import { AuthenticateStudentUseCase } from '@/domain/forum/aplication/use-cases/authenticate-student'
import { RegisterStudentUseCase } from '@/domain/forum/aplication/use-cases/register-student'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'
import { GetQuestionBySlugUseCase } from '@/domain/forum/aplication/use-cases/get-question-by-slug'
import { EditQuestionController } from './controllers/edit-question.controller'
import { EditQuestionUseCase } from '@/domain/forum/aplication/use-cases/edit-question'
import { DeleteQuestionController } from './controllers/delete-question.controller'
import { DeleteQuestionUseCase } from '@/domain/forum/aplication/use-cases/delete-question'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    AuthenticateStudentUseCase,
    RegisterStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
  ],
})
export class HttpModule {}
