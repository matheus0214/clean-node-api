import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '../../domain/usecases'
import { AccountModel } from '../../domain/models'

const makeFakeAccount = (): AccountModel => {
  return {
    email: 'any_email',
    id: 'any_id',
    name: 'any_name',
    password: 'any_password'
  }
}

interface ISutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (): ISutTypes => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }

  const loadAccountByTokenStub = new LoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub)

  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth middleware', () => {
  test('should return 403 if not x-access-token existis in headers', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call LoadAccountByToken with correct value', async () => {
    const { loadAccountByTokenStub, sut } = makeSut()

    const spy = jest.spyOn(loadAccountByTokenStub, 'load')

    await sut.handle({
      headers: {
        'x-access-token': 'valid_token'
      }
    })

    expect(spy).toBeCalledTimes(1)
  })
})
