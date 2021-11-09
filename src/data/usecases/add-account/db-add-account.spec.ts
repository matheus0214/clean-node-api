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

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'Terry Mills',
  email: 'zilsu@pitarcu.gs',
  password: 'Z1fPiNQOIUzwBwG2duA1MO4t2KSg'
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'Terry Mills',
  email: 'zilsu@pitarcu.gs',
  password: 'value_encrypt'
})

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
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

    const encrptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(makeFakeAccountData())

    expect(encrptSpy).toHaveBeenCalledWith('value_encrypt')
  })

  test('Should throw if Encrypter thorws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const promise = sut.add(makeFakeAccountData())

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(makeFakeAccountData())

    expect(addSpy).toHaveBeenCalledWith(makeFakeAccountData())
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const promise = sut.add(makeFakeAccountData())

    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.add(makeFakeAccountData())

    expect(account).toEqual(makeFakeAccount())
  })
})
