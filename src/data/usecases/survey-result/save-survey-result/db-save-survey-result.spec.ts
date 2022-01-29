
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { mockSaveSurveyResultRepository } from '@/data/test'
import { mockSurveyResultModel, mockSurveyResultParams } from '@/domain/test/mock-survey-result'
import MockDate from 'mockdate'

import { DbSaveSurveyResult } from './db-save-survey-result'

type ISutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): ISutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)

  return { sut, saveSurveyResultRepositoryStub }
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

  it('should throw if saveSurveyResultRepositoryStub throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()

    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(
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
