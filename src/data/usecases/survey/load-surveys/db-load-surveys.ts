import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}
  async load (accountId: string): Promise<SurveyModel[]> {
    return await this.loadSurveysRepository.loadAll(accountId)
  }
}
