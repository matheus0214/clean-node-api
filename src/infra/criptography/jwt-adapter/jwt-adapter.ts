import jwt from 'jsonwebtoken'

import { Encrypter } from '../../../data/protocols/cryptography/encrypter'

export class JwtAdapter implements Encrypter {
  private readonly secretKey: string

  constructor (secretKey: string) {
    this.secretKey = secretKey
  }

  async encrypt (data: string): Promise<string> {
    await jwt.sign({ id: data }, this.secretKey)
    return ''
  }
}
