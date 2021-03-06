import MockDate from 'mockdate'

import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { ok, serverError } from '../../../helpers/http/http-helper'
import { InvalidParamError } from '../../../errors/invalid-param-error'
import { forbidden } from '../../survey/load-surveys/load-surveys-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, LoadSurveyById } from './save-survey-result-controller-protocols'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { mockLoadSurveyById } from '@/presentation/test/mock-load-survey'
import { mockSaveSurveyResult } from '@/presentation/test'

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

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const saveSurveyResultStub = mockSaveSurveyResult()
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

    await sut.handle(makeFakeRequest())

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

    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
