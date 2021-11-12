import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('name')
    const error = sut.validate({ field: 'any' })

    expect(error).toEqual(new MissingParamError('name'))
  })

  test('Should not return a if validation suceeds', () => {
    const sut = new RequiredFieldValidation('name')
    const success = sut.validate({ name: 'any' })

    expect(success).toBeFalsy()
  })
})
