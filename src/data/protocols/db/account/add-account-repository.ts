import { AccountModel } from '@/domain/models'
import { AddAccountModel } from '@/domain/usecases/account/add-account'

export interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
