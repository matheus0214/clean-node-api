import { LoadAccountByToken } from '@/domain/usecases'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

interface SutTypes {
  sut: LoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'Terry Mills',
  email: 'zilsu@pitarcu.gs',
  password: 'Z1fPiNQOIUzwBwG2duA1MO4t2KSg'
})

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (data: string): Promise<string> {
      return 'valid_token'
    }
  }

  return new DecrypterStub()
}

const makeLoadAccountByTokenRepositoryStub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }

  return new LoadAccountByTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepositoryStub()

  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)

  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByYoken usecase', () => {
  test('should call Decrypter with correct values', async () => {
    const { decrypterStub, sut } = makeSut()
    const spy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.load('any_token', 'any_role')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('any_token')
  })

  test('should return null if Decrypter return null', async () => {
    const { decrypterStub, sut } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.load('any_token', 'any_role')

    expect(response).toBe(null)
  })

  test('should call LoadAccountByTokenRepository with correct value', async () => {
    const { loadAccountByTokenRepositoryStub, sut } = makeSut()

    const spy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')

    await sut.load('any_token', 'any_role')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('any_token', 'any_role')
  })

  test('should return null if LoadAccountByTokenRepository return null', async () => {
    const { loadAccountByTokenRepositoryStub, sut } = makeSut()

    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.load('any_token', 'any_role')

    expect(response).toBe(null)
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()

    const response = await sut.load('any_token', 'any_role')

    expect(response).toEqual(makeFakeAccount())
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const promise = sut.load('any_token', 'any_role')

    await expect(promise).rejects.toThrow()
  })

  test('Should throw if loadAccountByTokenRepositoryStub throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const promise = sut.load('any_token', 'any_role')

    await expect(promise).rejects.toThrow()
  })
})
