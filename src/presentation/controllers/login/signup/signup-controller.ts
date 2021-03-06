import { badRequest, okCreated, serverError } from '@/presentation/helpers/http/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
  Validation,
  Authentication,
  EmailInUseError,
  forbidden
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

      const account = await this.addAccount.add({ email, name, password })
      if (!account) {
        return forbidden(new EmailInUseError())
      }

      const authenticationModel = await this.authentication.auth({
        email,
        password
      })

      return okCreated(authenticationModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
