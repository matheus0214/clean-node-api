import { HttpRequest, Validation } from './add-survey-protocols'
import { AddSurveyController } from './add-servey-controller'
import { badRequest } from '../../../helpers/http/http-helper'

interface ISutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})

const makeSut = (): ISutTypes => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  const validationStub = new ValidationStub()
  const sut = new AddSurveyController(validationStub)

  return { sut, validationStub }
}

describe('AddSurveyController', () => {
  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })

  test('should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error(''))

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
