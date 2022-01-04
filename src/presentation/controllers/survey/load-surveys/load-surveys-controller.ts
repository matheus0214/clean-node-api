import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './load-surveys-protocols'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load()
    return {
      statusCode: 200,
      body: {}
    }
  }
}
