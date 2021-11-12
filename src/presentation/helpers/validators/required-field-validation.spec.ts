import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('name')
    const error = sut.validate({ field: 'any' })

    expect(error).toEqual(new MissingParamError('name'))
  })
})
