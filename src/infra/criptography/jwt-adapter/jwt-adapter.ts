import jwt from 'jsonwebtoken'

import { Encrypter } from '@/data/protocols/cryptography/encrypter'
import { Decrypter } from '@/data/protocols/cryptography/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secretKey: string) {
    this.secretKey = secretKey
  }

  async encrypt (data: string): Promise<string> {
    return jwt.sign({ id: data }, this.secretKey)
  }

  async decrypt (data: string): Promise<string|null> {
    const response: any = jwt.verify(data, this.secretKey)

    return response
  }
}
