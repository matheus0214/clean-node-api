import { mockFakeAccountModel } from '@/domain/test'
import { AccountModel, LoadAccountByToken } from '../middlewares/auth-middleware-protocols'

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return mockFakeAccountModel()
    }
  }
  return new LoadAccountByTokenStub()
}
