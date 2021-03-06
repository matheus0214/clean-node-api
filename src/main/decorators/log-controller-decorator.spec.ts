import { mockLogErrorRepository } from '@/data/test'
import { mockFakeAccountModel } from '@/domain/test'
import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { serverError, okCreated } from '../../presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

type LogControllerTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

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

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise(resolve => resolve({
        body: mockFakeAccountModel(),
        statusCode: 201
      }))
    }
  }

  return new ControllerStub()
}

const makeSut = (): LogControllerTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = mockLogErrorRepository()
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

    expect(httpResponse).toEqual(okCreated(mockFakeAccountModel()))
  })

  test('Should call LogErrorRepository with correct error if controller return a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')

    jest.spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve(makeFakeServerError())))

    await sut.handle(makeFakeRequest())

    expect(logSpy).toBeCalledWith('any_error')
  })
})
