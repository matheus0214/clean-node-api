import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('name')
}

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any' })

    expect(error).toEqual(new MissingParamError('name'))
  })

  test('Should not return a if validation suceeds', () => {
    const sut = makeSut()
    const success = sut.validate({ name: 'any' })

    expect(success).toBeFalsy()
  })
})
