import { AddSurveyParams } from '@/data/usecases/survey/add-survey/add-survey-protocols'

export interface AddSurveyRepository {
  add: (account: AddSurveyParams) => Promise<void>
}
