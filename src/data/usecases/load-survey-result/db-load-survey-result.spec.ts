import MockDate from 'mockdate'

import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { mockLoadSurveyResultRepository } from '@/data/test'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { DbLoadSurveyResult } from './db-load-survey-result'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)

  return { sut, loadSurveyResultRepositoryStub }
}

describe('DbLoadSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()

    const spy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')

    await sut.load('any_survey_id')

    expect(spy).toBeCalledWith('any_survey_id')
  })

  it('should throw if saveSurveyResultRepositoryStub throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()

    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const promise = sut.load('any_survey_id')

    await expect(promise).rejects.toThrow()
  })

  test('should return surveyResultModel on success', async () => {
    const { sut } = makeSut()

    const response = await sut.load('any_survey_id')

    expect(response).toEqual(mockSurveyResultModel())
  })
})
