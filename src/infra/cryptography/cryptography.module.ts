import { Module } from '@nestjs/common'

import { Encrypter } from '@/domain/forum/aplication/cryptography/encrypter'
import { HashGenerator } from '@/domain/forum/aplication/cryptography/hash-generator'
import { HashComparer } from '@/domain/forum/aplication/cryptography/hash-comparer'

import { JwtEncrypter } from './jwt-encrypter'
import { BcryptHasher } from './bcrypt-hasher'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: HashComparer, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashGenerator, HashComparer],
})
export class CryptographyModule {}
