import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResultFactory = (): SaveSurveyResult => {
  const surveyResultRepository = new SurveyResultMongoRepository()
  const saveSurveyResult = new DbSaveSurveyResult(surveyResultRepository, surveyResultRepository)

  return saveSurveyResult
}
