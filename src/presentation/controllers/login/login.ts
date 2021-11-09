import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body

    if (!password) {
      return await new Promise((resolve) => resolve(badRequest(new MissingParamError('password'))))
    }

    if (!email) {
      return await new Promise((resolve) => resolve(badRequest(new MissingParamError('email'))))
    }

    const isValid = this.emailValidator.isValid(email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }

    return await new Promise((resolve) => resolve({ body: {}, statusCode: 200 }))
  }
}
