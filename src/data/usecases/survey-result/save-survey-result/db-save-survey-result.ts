import {
  SaveSurveyResultRepository,
  SurveyResultModel,
  SaveSurveyResult,
  SaveSurveyResultParams
} from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {}

  async save (survey: SaveSurveyResultParams): Promise<SurveyResultModel | undefined> {
    const result = await this.saveSurveyResultRepository.save(survey)
    if (result) {
      return result
    }

    return undefined
  }
}
