import { AccountModel } from '@/domain/models'

export type AddAccountModel = Omit<AccountModel, 'id'>

export type AddAccount = {
  add: (account: AddAccountModel) => Promise<AccountModel | null>
}