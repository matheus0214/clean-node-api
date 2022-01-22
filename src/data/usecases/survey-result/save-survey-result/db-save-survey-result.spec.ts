
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import MockDate from 'mockdate'

import { DbSaveSurveyResult } from './db-save-survey-result'

const makeFakeSurveyResult = (): SurveyResultModel => {
  return {
    id: 'any_id',
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
  }
}

const makeFakeSurveyResultData = (): SaveSurveyResultParams => {
  return {
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
  }
}

type ISutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (survey: SaveSurveyResultParams): Promise<SurveyResultModel | undefined> {
      return makeFakeSurveyResult()
    }
  }

  return new SaveSurveyResultRepositoryStub()
}

const makeSut = (): ISutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepositoryStub()
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

    const data = makeFakeSurveyResultData()

    await sut.save(data)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(data)
  })

  it('should throw if saveSurveyResultRepositoryStub throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()

    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const data = makeFakeSurveyResultData()

    const promise = sut.save(data)

    await expect(promise).rejects.toThrow()
  })

  it('should return survey on success', async () => {
    const { sut } = makeSut()

    const response = await sut.save(makeFakeSurveyResultData())

    expect(response).toEqual(makeFakeSurveyResult())
  })
})
