import { InvalidParamError } from '../../login/login/login-controller-protocols'
import { forbidden } from '../../login/signup/signup-controller-protocols'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(httpRequest.params.survey_id)
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'))
    }

    return {
      body: {},
      statusCode: 200
    }
  }
}
