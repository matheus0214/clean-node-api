
import { InvalidParamError } from '../../login/login/login-controller-protocols'
import { forbidden, SurveyModel } from '../../survey/load-surveys/load-surveys-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, LoadSurveyById } from './save-survey-result-controller-protocols'

const makeFakeRequest = (): HttpRequest => {
  return {
    params: {
      survey_id: 'any'
    }
  }
}

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: 'any_id_other',
    answers: [
      {
        answer: 'any_other'
      }
    ],
    date: new Date(),
    question: 'any_question_other'
  }
}

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel | undefined> {
      return makeFakeSurvey()
    }
  }

  return new LoadSurveyByIdStub()
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub)

  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('SaveSurveyResult controller', () => {
  test('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()

    const spy = jest.spyOn(loadSurveyByIdStub, 'loadById')

    await sut.handle(makeFakeRequest())

    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(makeFakeRequest().params.survey_id)
  })

  test('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()

    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(undefined))

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
})
