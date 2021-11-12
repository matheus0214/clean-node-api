import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

interface ValidationCompositeTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
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
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(
    validationStubs
  )

  return {
    sut,
    validationStubs
  }
}
describe('ValidationComposite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()

    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('name'))

    const error = sut.validate({ field: 'any' })

    expect(error).toEqual(new MissingParamError('name'))
  })

  test('Should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut()

    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('name'))

    const error = sut.validate({ field: 'any' })

    expect(error).toEqual(new Error())
  })

  test('Should not returns if validation succedd', () => {
    const { sut } = makeSut()

    const error = sut.validate({ field: 'any' })

    expect(error).toBeFalsy()
  })
})
