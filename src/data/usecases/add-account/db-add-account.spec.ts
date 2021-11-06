import { DbAddAccount } from './db-add-account'

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => resolve('value_encrypt'))
      }
    }

    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)

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
