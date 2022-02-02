import { LoadSurveyByIdRepository } from '../survey/load-survey-by-id/db-load-survey-by-id-protocols'
import {
  LoadSurveyResultRepository,
  LoadSurveyResult,
  SurveyResultModel
} from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load (surveyId: string): Promise<SurveyResultModel | undefined> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)

    if (!surveyResult) {
      await this.loadSurveyByIdRepository.loadById(surveyId)
    }

    return surveyResult
  }
}
