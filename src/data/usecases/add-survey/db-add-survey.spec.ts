
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

interface ISutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (account: AddSurveyModel): Promise<void> {}
  }

  return new AddSurveyRepositoryStub()
}

const makeSut = (): ISutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)

  return { sut, addSurveyRepositoryStub }
}

describe('DbAddSurvey Usecase', () => {
  test('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()

    const spy = jest.spyOn(addSurveyRepositoryStub, 'add')

    const data = makeFakeSurveyData()

    await sut.add(data)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(data)
  })
})
