import MockDate from 'mockdate'

import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { ok, serverError } from '../../../helpers/http/http-helper'
import { InvalidParamError } from '../../../errors/invalid-param-error'
import { forbidden, SurveyModel } from '../../survey/load-surveys/load-surveys-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, LoadSurveyById } from './save-survey-result-controller-protocols'

const makeFakeRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: 'any'
    },
    body: {
      answer: 'any_answer'
    },
    accountId: 'any_account_id'
  }
}

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: 'any_id_other',
    answers: [
      {
        answer: 'any_other'
      },
      {
        answer: 'any_answer'
      }
    ],
    date: new Date(),
    question: 'any_question_other'
  }
}

const makeFakeSurveyResultModel = (): SurveyResultModel => {
  return {
    accountId: 'any_account_id',
    answer: 'any_answer',
    date: new Date(),
    id: 'any_id',
    surveyId: 'any_survey_id'
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

const makeSaveSurveyResultStub = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (survey: SaveSurveyResultParams): Promise<SurveyResultModel | undefined> {
      return makeFakeSurveyResultModel()
    }
  }

  return new SaveSurveyResultStub()
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSaveSurveyResultStub()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)

  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()

    const spy = jest.spyOn(loadSurveyByIdStub, 'loadById')

    await sut.handle(makeFakeRequest())

    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(makeFakeRequest().params.surveyId)
  })

  test('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()

    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(undefined))

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()

    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(() => {
      throw new Error('')
    })

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 403 if and invalid answer is provided', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({
      params: {
        surveyId: 'any'
      },
      body: {
        answer: 'wrong_answer'
      }
    })

    expect(response).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()

    const spy = jest.spyOn(saveSurveyResultStub, 'save')

    const r = await sut.handle(makeFakeRequest())
    console.log(r)

    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith({
      surveyId: makeFakeRequest().params.surveyId,
      accountId: makeFakeRequest().accountId,
      date: new Date(),
      answer: 'any_answer'
    })
  })

  test('should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()

    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(() => {
      throw new Error('')
    })

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakeSurveyResultModel()))
  })
})
