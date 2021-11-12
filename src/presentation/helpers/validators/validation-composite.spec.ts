import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

describe('ValidationComposite', () => {
  test('Should return an error if any validation fails', () => {
    class ValidationStub implements Validation {
      validate (input: any): Error | null {
        return new MissingParamError('name')
      }
    }
    const sut = new ValidationComposite([
      new ValidationStub()
    ])
    const error = sut.validate({ field: 'any' })

    expect(error).toEqual(new MissingParamError('name'))
  })
})
