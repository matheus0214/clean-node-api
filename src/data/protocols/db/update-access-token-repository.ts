export interface UpdateAccessTokenRepository {
  updateAccessToken: (data: string, token: string) => Promise<void>
}
