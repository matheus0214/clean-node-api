import { LoadSurveyResultRepository } from '../../load-survey-result/db-load-survey-result-protocols'
import {
  SaveSurveyResultRepository,
  SurveyResultModel,
  SaveSurveyResult,
  SaveSurveyResultParams
} from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (survey: SaveSurveyResultParams): Promise<SurveyResultModel | undefined> {
    await this.saveSurveyResultRepository.save(survey)
    const result = await this.loadSurveyResultRepository.loadBySurveyId(survey.surveyId, survey.accountId)
    if (result) {
      return result
    }

    return undefined
  }
}
