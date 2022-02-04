import { LoadSurveysRepository } from './db-load-surveys-protocols'
import { DbLoadSurveys } from './db-load-surveys'
import MockDate from 'mockdate'
import { mockLoadSurveysRepository } from '@/data/test'
import { mockFakeAccountModel, mockSurveyModels } from '@/domain/test'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepository: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepository = mockLoadSurveysRepository()

  const sut = new DbLoadSurveys(loadSurveysRepository)

  return {
    sut, loadSurveysRepository
  }
}

describe('DbLoadSurveys usecase', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })
  it('should call LoadSurveysRepository', async () => {
    const { loadSurveysRepository, sut } = makeSut()
    const spy = jest.spyOn(loadSurveysRepository, 'loadAll')

    const accountId = mockFakeAccountModel().id

    await sut.load(accountId)

    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(accountId)
  })

  it('should return a list of surveys on success', async () => {
    const { sut } = makeSut()

    const response = await sut.load(mockFakeAccountModel().id)

    expect(response).toEqual(mockSurveyModels())
  })

  it('should throw if loadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepository } = makeSut()

    jest.spyOn(loadSurveysRepository, 'loadAll').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const promise = sut.load(mockFakeAccountModel().id)

    await expect(promise).rejects.toThrow()
  })
})
