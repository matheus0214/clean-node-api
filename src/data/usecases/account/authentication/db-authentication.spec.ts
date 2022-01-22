import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'
import {
  AuthenticationParams,
  HashCompare,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'valid_id',
    email: 'any_email@mail.com',
    password: 'hashed_password',
    name: 'any_name'
  }
}

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeFakeAuthentication = (): AuthenticationParams => {
  return {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashCompare
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (value: string, hash: string): Promise<boolean> {
      return true
    }
  }

  return new HashCompareStub()
}

const makeEncrypterGenerator = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (data: string): Promise<string> {
      return 'token'
    }
  }

  return new EncrypterStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (data: string, token: string): Promise<void> {}
  }

  return new UpdateAccessTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const hashCompareStub = makeHashCompare()
  const encrypterStub = makeEncrypterGenerator()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub, encrypterStub,
    updateAccessTokenRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.auth(makeFakeAuthentication())

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  test('Should return null LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBeNull()
  })

  test('Should call HashCompare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut()

    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth(makeFakeAuthentication())

    expect(compareSpy).toBeCalledWith('any_password', 'hashed_password')
  })

  test('Should call HashCompare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut()

    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth(makeFakeAuthentication())

    expect(compareSpy).toBeCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut()

    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComapre returns false', async () => {
    const { sut, hashCompareStub } = makeSut()

    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBeNull()
  })

  test('Should call EncrypterGenerator with correct id', async () => {
    const { sut, encrypterStub } = makeSut()

    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.auth(makeFakeAuthentication())

    expect(encrypterSpy).toBeCalledWith('valid_id')
  })

  test('Should throw if EncrypterGenerator throws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  test('Should throw if EncrypterGenerator throws', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBe('token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(makeFakeAuthentication())

    expect(updateSpy).toBeCalledWith('valid_id', 'token')
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })
})
