import { SurveyResultModel } from '@/domain/models/survey-result'

export type LoadSurveyResult = {
  load: (surveyId: string, accountId: string) => Promise<SurveyResultModel | undefined>
}
