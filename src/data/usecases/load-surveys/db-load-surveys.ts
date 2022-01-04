import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository'

export class DbLoadSurveys implements LoadSurveysRepository {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}
  async loadAll (): Promise<SurveyModel[]> {
    return await this.loadSurveysRepository.loadAll()
  }
}
