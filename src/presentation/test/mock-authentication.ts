import { AuthenticationModel } from '@/domain/models/authentication'
import { mockFakeAccountModel } from '@/domain/test'
import { Authentication } from '../controllers/login/signup/signup-controller-protocols'

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth ({ email, password }): Promise<AuthenticationModel | null> {
      return {
        accessToken: 'access_token',
        name: mockFakeAccountModel().name
      }
    }
  }

  return new AuthenticationStub()
}
