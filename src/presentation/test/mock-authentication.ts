import { Authentication } from '../controllers/login/signup/signup-controller-protocols'

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth ({ email, password }): Promise<string> {
      return await new Promise(resolve => resolve('access_token'))
    }
  }

  return new AuthenticationStub()
}
