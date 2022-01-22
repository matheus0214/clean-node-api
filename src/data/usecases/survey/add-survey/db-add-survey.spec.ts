
import MockDate from 'mockdate'

import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository, AddSurveyParams } from './add-survey-protocols'

const makeFakeSurveyData = (): AddSurveyParams => {
  return {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
}

type ISutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (account: AddSurveyParams): Promise<void> {}
  }

  return new AddSurveyRepositoryStub()
}

const makeSut = (): ISutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)

  return { sut, addSurveyRepositoryStub }
}

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()

    const spy = jest.spyOn(addSurveyRepositoryStub, 'add')

    const data = makeFakeSurveyData()

    await sut.add(data)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(data)
  })

  test('Should throw if Hasher thorws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()

    jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const promise = sut.add(makeFakeSurveyData())

    await expect(promise).rejects.toThrow()
  })
})
