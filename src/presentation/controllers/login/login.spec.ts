import { InvalidParamError, MissingParamError } from '../../errors'
import { LoginController } from './login'
import { badRequest, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

interface LoginSutTypes {
  sut: Controller
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorSutb implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorSutb()
}

const makeSut = (): LoginSutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'jip@majug.za',
    password: '123'
  }
})
describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        password: '123'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'jip@majug.za'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(
      false
    )

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const emailSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(makeFakeRequest())

    expect(emailSpy).toBeCalledWith('jip@majug.za')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation((email: string) => {
      throw new Error('')
    })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error('')))
  })
})
