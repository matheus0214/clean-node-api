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

describe('DbLoadSurveys usecase', () => {
  it('should call LoadSurveysRepository', async () => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
      async loadAll (): Promise<SurveyModel[]> {
        return makeFakeSurveys()
      }
    }

    const loadSurveysRepository = new LoadSurveysRepositoryStub()

    const spy = jest.spyOn(loadSurveysRepository, 'loadAll')

    const sut = new DbLoadSurveys(loadSurveysRepository)

    await sut.loadAll()

    expect(spy).toBeCalled()
  })
})
