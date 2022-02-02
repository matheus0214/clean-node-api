import {
  MissingParamError,
  badRequest, serverError, unauthorized,
  Controller, HttpRequest,
  Authentication,
  ok,
  Validation
} from './login-controller-protocols'
import { LoginController } from './login-controller'
import { mockAuthentication, mockValidation } from '@/presentation/test'
import { mockFakeAccountModel } from '@/domain/test'

type LoginSutTypes = {
  sut: Controller
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): LoginSutTypes => {
  const authenticationStub = mockAuthentication()
  const validationStub = mockValidation()
  const sut = new LoginController(validationStub, authenticationStub)

  return {
    sut,
    validationStub,
    authenticationStub
  }
}

const mockRequest = (): HttpRequest => ({
  body: {
    email: 'jip@majug.za',
    password: '123'
  }
})
describe('Login Controller', () => {
  test('Should call Authentication with correct value', async () => {
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(mockRequest())

    expect(authSpy).toBeCalledWith({ email: 'jip@majug.za', password: '123' })
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error('')))
    )

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error('')))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok({ accessToken: 'access_token', name: mockFakeAccountModel().name }))
  })

  test('Should call Validatoin with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(mockRequest())

    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })

  test('Should return 400 if validation return an error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
