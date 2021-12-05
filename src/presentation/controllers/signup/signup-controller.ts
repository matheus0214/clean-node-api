import { badRequest, okCreated, serverError } from '../../helpers/http/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
  Validation,
  Authentication
} from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { password, email, name } = httpRequest.body

      await this.addAccount.add({ email, name, password })

      const accessToken = await this.authentication.auth({
        email,
        password
      })

      return okCreated({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
