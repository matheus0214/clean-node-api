import { badRequest } from '../../login/signup/signup-controller-protocols'
import {
  AddSurvey,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return badRequest(error)
    }

    const { answers, question } = httpRequest.body

    await this.addSurvey.add({
      answers,
      question
    })

    return {
      body: {},
      statusCode: 201
    }
  }
}
