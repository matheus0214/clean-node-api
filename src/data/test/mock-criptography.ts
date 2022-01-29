import { Decrypter } from '../protocols/cryptography/decrypter'
import { Encrypter } from '../protocols/cryptography/encrypter'
import { HashCompare } from '../protocols/cryptography/hash-compare'
import { Hasher } from '../protocols/cryptography/hasher'

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => resolve('any_password'))
    }
  }

  return new HasherStub()
}

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (data: string): Promise<string> {
      return 'valid_token'
    }
  }

  return new DecrypterStub()
}

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (data: string): Promise<string> {
      return 'token'
    }
  }

  return new EncrypterStub()
}

export const mockHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (value: string, hash: string): Promise<boolean> {
      return true
    }
  }

  return new HashCompareStub()
}
