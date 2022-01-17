import { AccountModel } from '../models'

export type AddAccountModel = {
  name: string
  email: string
  password: string
}

export type AddAccount = {
  add: (account: AddAccountModel) => Promise<AccountModel | null>
}
