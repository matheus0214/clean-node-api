import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface DbAccountTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('value_encrypt'))
    }
  }

  return new EncrypterStub()
}

const makeSut = (): DbAccountTypes => {
  const encrypterStub = makeEncrypter()

  return {
    sut: new DbAddAccount(encrypterStub),
    encrypterStub
  }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()

    const accountData = {
      name: 'Helen Snyder',
      email: 'ewe@elakono.pl',
      password: '1234'
    }

    const encrptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(accountData)

    expect(encrptSpy).toHaveBeenCalledWith('1234')
  })

  test('Should throw if Encrypter thorws', async () => {
    const { sut, encrypterStub } = makeSut()

    const accountData = {
      name: 'Helen Snyder',
      email: 'ewe@elakono.pl',
      password: '1234'
    }

    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })
})
