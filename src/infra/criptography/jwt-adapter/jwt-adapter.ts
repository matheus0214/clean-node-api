import jwt from 'jsonwebtoken'

import { Encrypter } from '../../../data/protocols/cryptography/encrypter'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secretKey: string) {
    this.secretKey = secretKey
  }

  async encrypt (data: string): Promise<string> {
    return jwt.sign({ id: data }, this.secretKey)
  }
}
