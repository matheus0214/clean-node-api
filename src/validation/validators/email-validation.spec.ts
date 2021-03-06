import { InvalidParamError } from '../../presentation/errors'
import { EmailValidator } from '../protocols/email-validator'
import { mockEmailValidator } from '../test'
import { EmailValidation } from './email-validation'

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  test('Should return an error if EmailValidator is false', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const error = sut.validate({ email: 'any_email@mail.com' })

    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should call email validator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate({
      email: 'puvbuk@bov.es'
    })

    expect(isValidSpy).toHaveBeenCalledWith('puvbuk@bov.es')
  })

  test('Should return throw if email validator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation((email: string) => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })
})
