import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository'
import { DbLoadSurveys } from './db-load-surveys'

const makeFakeSurveys = (): SurveyModel[] => {
  return [{
    answers: [
      {
        answer: 'any'
      }
    ],
    date: new Date(),
    id: 'any_id',
    question: 'any_question'
  },
  {
    answers: [
      {
        answer: 'any_other'
      }
    ],
    date: new Date(),
    id: 'any_id_other',
    question: 'any_question_other'
  }]
}

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepository: LoadSurveysRepository
}

const makeFakeLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return makeFakeSurveys()
    }
  }

  return new LoadSurveysRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveysRepository = makeFakeLoadSurveysRepositoryStub()

  const sut = new DbLoadSurveys(loadSurveysRepository)

  return {
    sut, loadSurveysRepository
  }
}

describe('DbLoadSurveys usecase', () => {
  it('should call LoadSurveysRepository', async () => {
    const { loadSurveysRepository, sut } = makeSut()
    const spy = jest.spyOn(loadSurveysRepository, 'loadAll')

    await sut.loadAll()

    expect(spy).toBeCalled()
  })
})
