import { AccountModel, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

interface DbAccountTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('value_encrypt'))
    }
  }

  return new EncrypterStub()
}

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve({
        id: 'valid_id',
        ...account
      }))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeSut = (): DbAccountTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepositoryStub()

  return {
    sut: new DbAddAccount(encrypterStub, addAccountRepositoryStub),
    encrypterStub,
    addAccountRepositoryStub
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

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const accountData = {
      name: 'Helen Snyder',
      email: 'ewe@elakono.pl',
      password: '1234'
    }

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(accountData)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'Helen Snyder',
      email: 'ewe@elakono.pl',
      password: 'value_encrypt'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const accountData = {
      name: 'Helen Snyder',
      email: 'ewe@elakono.pl',
      password: '1234'
    }

    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })
})
