import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger'

import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/aplication/use-cases/upload-and-create-attachment'
import { InvalidAttachmentTypeError } from '@/domain/forum/aplication/use-cases/errors/invalid-attachment-type'

@ApiTags('Anexos')
@ApiBearerAuth()
@ApiConsumes('multipart/form-data')
@ApiBadRequestResponse({ description: 'Arquivo inválido ou tipo não permitido' })
@Controller('/attachments')
export class UploadAttachmentController {
  constructor(
    private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Fazer upload de arquivo (imagem ou PDF)' })
  @ApiResponse({ status: 201, description: 'Arquivo uploaded com sucesso', schema: { example: { attachmentId: 'uuid-do-anexo' } } })
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAndCreateAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new BadRequestException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }

    const { attachment } = result.value

    return {
      attachmentId: attachment.id.toString(),
    }
  }
}
