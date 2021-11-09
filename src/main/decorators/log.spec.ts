import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { AccountModel } from '../../domain/models'
import { serverError, okCreated } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface LogControllerTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'Terry Mills',
  email: 'zilsu@pitarcu.gs',
  password: 'Z1fPiNQOIUzwBwG2duA1MO4t2KSg'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'Raymond Guerrero',
    email: 'zejno@rufacige.sl',
    password: 'hy6YJ4o5Ep65fLpSUjY',
    passwordConfirmation: 'hy6YJ4o5Ep65fLpSUjY'
  }
})

const makeFakeServerError = (): HttpResponse => {
  const error = new Error()
  error.stack = 'any_error'

  return serverError(error)
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepositoryStub {
    async log (stack: string): Promise<void> { }
  }

  return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise(resolve => resolve({
        body: makeFakeAccount(),
        statusCode: 201
      }))
    }
  }

  return new ControllerStub()
}

const makeSut = (): LogControllerTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogControllerDecorator', () => {
  test('Should call controller handle', async () => {
    const { controllerStub, sut } = makeSut()

    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(makeFakeRequest())

    expect(handleSpy).toBeCalledWith(makeFakeRequest())
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(okCreated(makeFakeAccount()))
  })

  test('Should call LogErrorRepository with correct error if controller return a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise((resolve, reject) => resolve(makeFakeServerError())))

    await sut.handle(makeFakeRequest())

    expect(logSpy).toBeCalledWith('any_error')
  })
})
