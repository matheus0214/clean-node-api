
import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository, AddSurveyModel } from './add-survey-protocols'

const makeFakeSurveyData = (): AddSurveyModel => {
  return {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
}

describe('DbAddSurvey Usecase', () => {
  test('should call AddSurveyRepository with correct values', async () => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
      async add (account: AddSurveyModel): Promise<void> {}
    }

    const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
    const sut = new DbAddSurvey(addSurveyRepositoryStub)

    const spy = jest.spyOn(addSurveyRepositoryStub, 'add')

    const data = makeFakeSurveyData()

    await sut.add(data)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(data)
  })
})
