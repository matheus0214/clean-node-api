import { SignUpController } from './signup'
import { MissingParamError, ServerError } from '../../errors'
import { Validation, AccountModel, AddAccount, AddAccountModel, HttpRequest } from './signup-protocols'
import { okCreated, serverError, badRequest } from '../../helpers/http-helper'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'Terry Mills',
  email: 'zilsu@pitarcu.gs',
  password: 'Z1fPiNQOIUzwBwG2duA1MO4t2KSg'
})

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountStub()
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error|null {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccountStub()
  const validationStub = makeValidationStub()
  const sut = new SignUpController(addAccountStub, validationStub)

  return {
    sut,
    addAccountStub,
    validationStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'Raymond Guerrero',
    email: 'zejno@rufacige.sl',
    password: 'hy6YJ4o5Ep65fLpSUjY',
    passwordConfirmation: 'hy6YJ4o5Ep65fLpSUjY'
  }
})

describe('SignUp Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementation(async (account: AddAccountModel) => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(makeFakeRequest())

    expect(addSpy).toBeCalledWith({
      name: 'Raymond Guerrero',
      email: 'zejno@rufacige.sl',
      password: 'hy6YJ4o5Ep65fLpSUjY'
    })
  })

  test('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(okCreated(makeFakeAccount()))
  })

  test('Should call Validatoin with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(makeFakeRequest())

    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })

  test('Should return 400 if validation return an error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
