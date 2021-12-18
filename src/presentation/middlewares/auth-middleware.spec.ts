import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
describe('Auth middleware', () => {
  test('should return 403 if not x-access-token existis in headers', async () => {
    const sut = new AuthMiddleware()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
