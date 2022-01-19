import { SurveyResultModel } from '@/domain/models/survey-result'

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>

export type SaveSurveyResult = {
  save: (survey: SaveSurveyResultModel) => Promise<SurveyResultModel | undefined>
}
