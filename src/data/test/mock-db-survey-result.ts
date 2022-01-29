import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { SaveSurveyResultRepository } from '../protocols/db/survey-result/save-survey-result-repository'
import {
  SaveSurveyResultParams,
  SurveyResultModel
} from '../usecases/survey-result/save-survey-result/db-save-survey-result-protocols'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (survey: SaveSurveyResultParams): Promise<SurveyResultModel | undefined> {
      return mockSurveyResultModel()
    }
  }

  return new SaveSurveyResultRepositoryStub()
}
