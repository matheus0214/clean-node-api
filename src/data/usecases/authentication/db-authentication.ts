import {
  Authentication,
  AuthenticationModel,
  HashCompare,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare
  private readonly encrypter: Encrypter
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.encrypter = encrypter
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (data: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(data.email)
    if (account) {
      const isValid = await this.hashCompare.compare(
        data.password,
        account?.password
      )
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)

        await this.updateAccessTokenRepository.update(account.id, accessToken)

        return accessToken
      }
    }

    return null
  }
}
