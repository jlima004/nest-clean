import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV } from './env'

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<ENV, true>) {}

  get<T extends keyof ENV>(key: T) {
    return this.configService.get(key, { infer: true })
  }
}
