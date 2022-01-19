import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-surveys-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'
import MockDate from 'mockdate'
import { DbLoadSurveyById } from './db-load-survey-by-id-repository'

type SutTypes = {
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
  sut: DbLoadSurveyById
}

const makeFakeSurvey = (): SurveyModel => {
  return {
    answers: [
      {
        answer: 'any'
      }
    ],
    date: new Date(),
    id: 'any_id',
    question: 'any_question'
  }
}

const makeFakeLoadSurveyRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return makeFakeSurvey()
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

    expect(response).toEqual(makeFakeSurvey())
  })
})
