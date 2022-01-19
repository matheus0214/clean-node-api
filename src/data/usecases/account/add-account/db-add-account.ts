import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'
import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) { }

  async add (account: AddAccountModel): Promise<AccountModel | null> {
    const searchAccount = await this.loadAccountByEmailRepository.loadByEmail(account.email)
    if (searchAccount) {
      return null
    }

    const hashedPassword = await this.hasher.hash(account.password)

    const newAccount = await this.addAccountRepository.add(Object.assign({}, account, {
      password: hashedPassword
    }))

    return await new Promise(resolve => resolve(newAccount))
  }
}
