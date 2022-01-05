import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveys,
  noContent,
  ok,
  serverError
} from './load-surveys-protocols'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.loadAll()
      if (surveys.length) {
        return ok(surveys)
      }

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
