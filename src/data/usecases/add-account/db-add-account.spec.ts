import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface DbAccountTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeSut = (): DbAccountTypes => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('value_encrypt'))
    }
  }

  const encrypterStub = new EncrypterStub()

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
})
