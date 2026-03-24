import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger'

import { ReadNotificationUseCase } from '@/domain/notification/aplication/use-cases/read-notification'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@ApiTags('Notificações')
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'ID inválido' })
@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  @ApiResponse({ status: 204, description: 'Notificação marcada como lida' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('notificationId') notificationId: string,
  ) {
    const result = await this.readNotification.execute({
      notificationId,
      recipientId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
