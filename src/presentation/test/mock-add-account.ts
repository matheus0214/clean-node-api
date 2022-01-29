import { mockFakeAccountModel } from '@/domain/test'
import { AccountModel, AddAccount, AddAccountParams } from '../controllers/login/signup/signup-controller-protocols'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await new Promise(resolve => resolve(mockFakeAccountModel()))
    }
  }

  return new AddAccountStub()
}
