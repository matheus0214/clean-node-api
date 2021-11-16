export interface UpdateAccessTokenRepository {
  update: (data: string, token: string) => Promise<void>
}
