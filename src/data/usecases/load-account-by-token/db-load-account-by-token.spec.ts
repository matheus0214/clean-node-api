import { LoadAccountByToken } from '../../../domain/usecases'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

interface SutTypes {
  sut: LoadAccountByToken
  decrypterStub: Decrypter
}

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (data: string): Promise<string> {
      return 'valid_token'
    }
  }

  return new DecrypterStub()
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()

  const sut = new DbLoadAccountByToken(decrypterStub)

  return {
    sut,
    decrypterStub
  }
}

describe('DbLoadAccountByYoken usecase', () => {
  test('should call Decrypter with correct values', async () => {
    const { decrypterStub, sut } = makeSut()
    const spy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.load('any_token')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('any_token')
  })
})
