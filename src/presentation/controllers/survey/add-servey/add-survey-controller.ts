import { badRequest, noContent, serverError } from '../../login/signup/signup-controller-protocols'
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
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { answers, question } = httpRequest.body

      await this.addSurvey.add({
        answers,
        question,
        date: new Date()
      })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
