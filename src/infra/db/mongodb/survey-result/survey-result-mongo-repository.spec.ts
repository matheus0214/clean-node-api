import { Collection, ObjectId } from 'mongodb'
import MockDate from 'mockdate'

import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models'

let accountsCollection: Collection
// let surveyResultCollection: Collection
let surveyCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{
      answer: 'any_answer',
      image: 'any_image'
    }],
    date: new Date()
  })

  const survey = await surveyCollection.findOne({
    _id: new ObjectId(res.insertedId)
  })

  return MongoHelper.map(survey)
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountsCollection.insertOne({
    name: 'Maria Weaver',
    email: 'any_email@mail.com',
    password: 'any_password'
  })

  const account = await accountsCollection.findOne({
    _id: new ObjectId(res.insertedId)
  })

  return MongoHelper.map(account)
}

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

    accountsCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
  })

  describe('Save', () => {
    test('Should add a survey result if its new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSut()

      const inserted = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      expect(inserted).toBeTruthy()
      expect(inserted?.id).toBeTruthy()
    })
  })
})
