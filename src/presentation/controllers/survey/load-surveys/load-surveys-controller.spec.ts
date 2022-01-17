import MockDate from 'mockdate'

import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys, SurveyModel } from './load-surveys-protocols'
import { ok, serverError, noContent } from '@/presentation/helpers/http/http-helper'

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

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeLoadSurveysStub = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async loadAll (): Promise<SurveyModel[]> {
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
    const spy = jest.spyOn(loadSurveysStub, 'loadAll')

    await sut.handle({})

    expect(spy).toHaveBeenCalled()
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({})

    expect(response).toEqual(ok(makeFakeSurveys()))
  })

  test('should return 500 if load surveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()

    jest.spyOn(loadSurveysStub, 'loadAll').mockImplementationOnce(() => {
      throw new Error('')
    })

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 204 if LoadSurveys return empty', async () => {
    const { sut, loadSurveysStub } = makeSut()

    jest.spyOn(loadSurveysStub, 'loadAll').mockReturnValueOnce(Promise.resolve([]))

    const response = await sut.handle({})

    expect(response).toEqual(noContent())
  })
})
