import { SurveyAnswerModel } from '../models/survey'

export type AddSurveyModel = {
  question: string
  answers: SurveyAnswerModel[]
  date: Date
}
export type AddSurvey = {
  add: (survey: AddSurveyModel) => Promise<void>
}
