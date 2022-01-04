import MockDate from 'mockdate'

import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys, SurveyModel } from './load-surveys-protocols'

const makeFakeSurveys = (): SurveyModel[] => {
  return [{
    answers: [
      {
        answer: 'any'
      }
    ],
    date: new Date(),
    id: 'any_id',
    question: 'any_question'
  },
  {
    answers: [
      {
        answer: 'any_other'
      }
    ],
    date: new Date(),
    id: 'any_id_other',
    question: 'any_question_other'
  }]
}

interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeLoadSurveysStub = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return makeFakeSurveys()
    }
  }

  return new LoadSurveysStub()
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)

  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const spy = jest.spyOn(loadSurveysStub, 'load')

    await sut.handle({})

    expect(spy).toHaveBeenCalled()
  })
})
