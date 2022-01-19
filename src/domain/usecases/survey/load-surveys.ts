import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveys {
  loadAll: () => Promise<SurveyModel[]>
}
