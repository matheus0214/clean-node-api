import { Collection } from 'mongodb'
import MockDate from 'mockdate'

import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

let surveyCollection: Collection

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__ ?? '')
    MockDate.set(new Date())
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('Add', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()

      await sut.add({
        question: 'any_question',
        answers: [{
          answer: 'any_answer',
          image: 'any_image'
        }],
        date: new Date()
      })

      const survey = await surveyCollection.findOne({
        question: 'any_question'
      })

      expect(survey).toBeTruthy()
    })
  })
})
