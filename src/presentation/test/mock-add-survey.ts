import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyRepositoryStub implements AddSurvey {
    async add (account: AddSurveyParams): Promise<void> {}
  }

  return new AddSurveyRepositoryStub()
}
