import { mockSurveyModel } from '@/domain/test'
import MockDate from 'mockdate'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepository, SurveyModel } from './db-load-survey-by-id-protocols'

type SutTypes = {
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
  sut: DbLoadSurveyById
}

const makeFakeLoadSurveyRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeFakeLoadSurveyRepositoryStub()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)

  return {
    loadSurveyByIdRepositoryStub,
    sut
  }
}

describe('DbLoadSurveyById usecase', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })
  it('should call LoadSurveysRepository', async () => {
    const { loadSurveyByIdRepositoryStub, sut } = makeSut()
    const spy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')

    await sut.loadById('valid_id')

    expect(spy).toBeCalledWith('valid_id')
  })

  it('should return survey on success', async () => {
    const { sut } = makeSut()

    const response = await sut.loadById('any_id')

    expect(response).toEqual(mockSurveyModel())
  })

  it('should throw if loadSurveyByIdRepositoryStub throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()

    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const promise = sut.loadById('any_id')

    await expect(promise).rejects.toThrow()
  })
})
