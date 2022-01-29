import { LogErrorRepository } from '../protocols/db/log/log-error-repository'

export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepositoryStub {
    async logError (stack: string): Promise<void> { }
  }

  return new LogErrorRepositoryStub()
}
