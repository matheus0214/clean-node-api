import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

interface ValidationCompositeTypes {
  sut: ValidationComposite
  validationStub: Validation
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): ValidationCompositeTypes => {
  const validationStub = makeValidation()
  const sut = new ValidationComposite([
    validationStub
  ])

  return {
    sut,
    validationStub
  }
}
describe('ValidationComposite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('name'))

    const error = sut.validate({ field: 'any' })

    expect(error).toEqual(new MissingParamError('name'))
  })
})
