import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { AccountModel, EmailValidator, AddAccount, AddAccountModel } from './signup-protocols'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'Terry Mills',
        email: 'zilsu@pitarcu.gs',
        password: 'Z1fPiNQOIUzwBwG2duA1MO4t2KSg'
      }

      return fakeAccount
    }
  }

  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccountStub()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'takbezjaf@ro.hk',
        password: 'hy6YJ4o5Ep65fLpSUjY',
        passwordConfirmation: 'hy6YJ4o5Ep65fLpSUjY'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'Raymond Guerrero',
        password: 'hy6YJ4o5Ep65fLpSUjY',
        passwordConfirmation: 'hy6YJ4o5Ep65fLpSUjY'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'Raymond Guerrero',
        email: 'takbezjaf@ro.hk',
        passwordConfirmation: 'hy6YJ4o5Ep65fLpSUjY'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'Raymond Guerrero',
        email: 'takbezjaf@ro.hk',
        password: 'hy6YJ4o5Ep65fLpSUjY'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'Raymond Guerrero',
        email: 'invalid_email@ro.hk',
        password: 'hy6YJ4o5Ep65fLpSUjY',
        passwordConfirmation: 'hy6YJ4o5Ep65fLpSUjY'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 400 if password confirmation is not equals password', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'Raymond Guerrero',
        email: 'invalid_email@ro.hk',
        password: 'hy6YJ4o5Ep65fLpSUjY',
        passwordConfirmation: 'nz957KauogLgQXrmMBPYXJM'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should call email validator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'Raymond Guerrero',
        email: 'any_email@ro.hk',
        password: 'hy6YJ4o5Ep65fLpSUjY',
        passwordConfirmation: 'hy6YJ4o5Ep65fLpSUjY'
      }
    }

    sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any_email@ro.hk')
  })

  test('Should return 500 if email validator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation((email: string) => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'Raymond Guerrero',
        email: 'invalid_email@ro.hk',
        password: 'hy6YJ4o5Ep65fLpSUjY',
        passwordConfirmation: 'hy6YJ4o5Ep65fLpSUjY'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementation((account: AddAccountModel) => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'Raymond Guerrero',
        email: 'invalid_email@ro.hk',
        password: 'hy6YJ4o5Ep65fLpSUjY',
        passwordConfirmation: 'hy6YJ4o5Ep65fLpSUjY'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'Raymond Guerrero',
        email: 'invalid_email@ro.hk',
        password: 'hy6YJ4o5Ep65fLpSUjY',
        passwordConfirmation: 'hy6YJ4o5Ep65fLpSUjY'
      }
    }

    sut.handle(httpRequest)

    expect(addSpy).toBeCalledWith({
      name: 'Raymond Guerrero',
      email: 'invalid_email@ro.hk',
      password: 'hy6YJ4o5Ep65fLpSUjY'
    })
  })

  test('Should return 200 if valid data is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        id: 'valid_id',
        name: 'Terry Mills',
        email: 'zilsu@pitarcu.gs',
        password: 'Z1fPiNQOIUzwBwG2duA1MO4t2KSg',
        passwordConfirmation: 'Z1fPiNQOIUzwBwG2duA1MO4t2KSg'
      }
    }

    const response = sut.handle(httpRequest)

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({
      id: 'valid_id',
      name: 'Terry Mills',
      email: 'zilsu@pitarcu.gs',
      password: 'Z1fPiNQOIUzwBwG2duA1MO4t2KSg'
    })
  })
})