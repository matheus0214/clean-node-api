import { AccountModel } from '../models/account'
import { AddAccountParams } from '../usecases/account/add-account'
import { AuthenticationParams } from '../usecases/account/authentication'

export const mockFakeAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockFakeAccountData = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockFakeAuthentication = (): AuthenticationParams => {
  return {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}
