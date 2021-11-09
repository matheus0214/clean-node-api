import { MissingParamError } from '../../errors'
import { LoginController } from './login'
import { badRequest } from '../../helpers/http-helper'

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = new LoginController()

    const httpRequest = {
      body: {
        password: '123'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const sut = new LoginController()

    const httpRequest = {
      body: {
        email: 'jip@majug.za'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
