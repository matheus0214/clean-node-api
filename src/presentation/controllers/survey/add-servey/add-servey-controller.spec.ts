import { HttpRequest, Validation } from './add-survey-protocols'
import { AddSurveyController } from './add-servey-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})

describe('AddSurveyController', () => {
  test('should call Validation with correct values', async () => {
    class ValidationStub implements Validation {
      validate (input: any): Error | null {
        return null
      }
    }

    const validationStub = new ValidationStub()
    const sut = new AddSurveyController(validationStub)

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })
})
