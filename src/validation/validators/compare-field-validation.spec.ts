import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from './compare-field-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('password', 'confirmation')
}

describe('CompareFields Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      password: 'any',
      confirmation: 'wrong'
    })

    expect(error).toEqual(new InvalidParamError('confirmation'))
  })

  test('Should not return a if validation suceeds', () => {
    const sut = makeSut()
    const success = sut.validate({
      password: 'any',
      confirmation: 'any'
    })

    expect(success).toBeFalsy()
  })
})
