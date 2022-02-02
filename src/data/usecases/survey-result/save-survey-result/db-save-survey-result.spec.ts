
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { mockLoadSurveyResultRepository, mockSaveSurveyResultRepository } from '@/data/test'
import { mockSurveyResultModel, mockSurveyResultParams } from '@/domain/test/mock-survey-result'
import MockDate from 'mockdate'
import { LoadSurveyResultRepository } from '../../load-survey-result/db-load-survey-result-protocols'

import { DbSaveSurveyResult } from './db-save-survey-result'

type ISutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): ISutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)

  return { sut, saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub }
}

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()

    const spy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')

    const data = mockSurveyResultParams()

    await sut.save(data)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(data)
  })

  test('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()

    const spy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')

    const data = mockSurveyResultParams()

    await sut.save(data)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(data.surveyId)
  })

  it('should throw if saveSurveyResultRepositoryStub throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()

    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const data = mockSurveyResultParams()

    const promise = sut.save(data)

    await expect(promise).rejects.toThrow()
  })

  it('should throw if loadSurveyResultRepositoryStub throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()

    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const data = mockSurveyResultParams()

    const promise = sut.save(data)

    await expect(promise).rejects.toThrow()
  })

  it('should return survey on success', async () => {
    const { sut } = makeSut()

    const response = await sut.save(mockSurveyResultParams())

    expect(response).toEqual(mockSurveyResultModel())
  })
})
