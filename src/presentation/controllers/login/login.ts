import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body

    if (!password) {
      return await new Promise((resolve) => resolve(badRequest(new MissingParamError('password'))))
    }

    if (!email) {
      return await new Promise((resolve) => resolve(badRequest(new MissingParamError('email'))))
    }

    return await new Promise((resolve) => resolve({ body: {}, statusCode: 200 }))
  }
}
