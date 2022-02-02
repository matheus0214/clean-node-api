import { mockSurveyModel, mockSurveyModels } from '@/domain/test'
import { LoadSurveysRepository } from '../protocols/db/survey/load-surveys-repository'
import { AddSurveyParams, AddSurveyRepository } from '../usecases/survey/add-survey/add-survey-protocols'
import {
  LoadSurveyByIdRepository,
  SurveyModel
} from '../usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (account: AddSurveyParams): Promise<void> {}
  }

  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return mockSurveyModels()
    }
  }

  return new LoadSurveysRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}
