import { DbLoadSurveyById } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveyByIdFactory = (): LoadSurveyById => {
  const surveyRepository = new SurveyMongoRepository()
  const loadSurveyById = new DbLoadSurveyById(surveyRepository)

  return loadSurveyById
}
