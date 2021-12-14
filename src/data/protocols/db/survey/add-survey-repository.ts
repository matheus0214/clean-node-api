import { AddSurveyModel } from '../../../usecases/add-survey/add-survey-protocols'

export interface AddSurveyRepository {
  add: (account: AddSurveyModel) => Promise<void>
}
