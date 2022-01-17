import { SurveyModel } from '../models/survey'

export type AddSurveyModel = Omit<SurveyModel, 'id'>

export type AddSurvey = {
  add: (survey: AddSurveyModel) => Promise<void>
}
