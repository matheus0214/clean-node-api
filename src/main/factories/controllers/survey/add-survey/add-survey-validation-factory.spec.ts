import {
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../../validation/validators'
import { Validation } from '../../../../../presentation/protocols/validation'
import { makeAddSurveyValidation as sut } from './add-survey-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validators', () => {
    sut()

    const validations: Validation[] = []

    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toBeCalledWith(validations)
  })
})