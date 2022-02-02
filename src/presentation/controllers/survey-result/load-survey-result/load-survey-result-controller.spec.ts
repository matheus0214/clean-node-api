import { mockLoadSurveyById } from '@/presentation/test/mock-load-survey'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { HttpRequest, LoadSurveyById } from './load-survey-result-controller-protocols'

const mockRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: 'any_id'
    }
  }
}

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()

  const sut = new LoadSurveyResultController(loadSurveyByIdStub)

  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('LoadSurveyResultController', () => {
  test('should call LoadSurveyById with correct value', async () => {
    const { loadSurveyByIdStub, sut } = makeSut()
    const spy = jest.spyOn(loadSurveyByIdStub, 'loadById')

    await sut.handle(mockRequest())

    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith('any_id')
  })
})
