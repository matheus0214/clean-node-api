import { AddSurveyModel } from '@/data/usecases/survey/add-survey/add-survey-protocols'

export interface AddSurveyRepository {
  add: (account: AddSurveyModel) => Promise<void>
}
