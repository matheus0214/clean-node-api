import MockDate from 'mockdate'

import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { mockLoadSurveyByIdRepository, mockLoadSurveyResultRepository } from '@/data/test'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyByIdRepository } from '../survey/load-survey-by-id/db-load-survey-by-id-protocols'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)

  return { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub }
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

  test('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()

    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(undefined))
    const spy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')

    await sut.load('any_survey_id')

    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith('any_survey_id')
  })

  test('should return surveyResultModel with all answers count 0 if LoadSurveyResultRepository returns undefined',
    async () => {
      const { sut, loadSurveyResultRepositoryStub } = makeSut()

      jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(undefined))

      const response = await sut.load('any_survey_id')

      expect(response).toEqual(mockSurveyResultModel())
    })
})
