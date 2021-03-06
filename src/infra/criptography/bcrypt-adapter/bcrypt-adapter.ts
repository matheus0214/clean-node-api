import bcrypt from 'bcrypt'
import { HashCompare } from '@/data/protocols/cryptography/hash-compare'

import { Hasher } from '@/data/protocols/cryptography/hasher'

export class BcryptAdapter implements Hasher, HashCompare {
  constructor (private readonly salt: number) {
    this.salt = salt
  }

  async compare (value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }

  async hash (value: string): Promise<string> {
    const hashed = await bcrypt.hash(value, this.salt)

    return hashed
  }
}
