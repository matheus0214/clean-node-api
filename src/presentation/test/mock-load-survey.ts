import { mockSurveyModel, mockSurveyModels } from '@/domain/test'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { LoadSurveyById } from '../controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'
import { SurveyModel } from '../controllers/survey/load-surveys/load-surveys-protocols'

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (accountId: string): Promise<SurveyModel[]> {
      return mockSurveyModels()
    }
  }

  return new LoadSurveysStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel | undefined> {
      return mockSurveyModel()
    }
  }

  return new LoadSurveyByIdStub()
}
