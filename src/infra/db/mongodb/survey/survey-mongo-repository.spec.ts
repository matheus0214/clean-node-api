import { Collection, ObjectId } from 'mongodb'
import MockDate from 'mockdate'

import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { AccountModel } from '@/domain/models'

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

let surveyCollection: Collection
let accountsCollection: Collection
let surveyResultCollection: Collection

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

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyCollection.deleteMany({})

    accountsCollection = await MongoHelper.getCollection('accounts')
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

  describe('LoadAll', () => {
    test('Should load all surveys on success', async () => {
      const account = await makeAccount()
      const surveysInserted = await surveyCollection.insertMany([
        {
          question: 'any_question',
          answers: [{
            answer: 'any_answer',
            image: 'any_image'
          }],
          date: new Date()
        },
        {
          question: 'other_question',
          answers: [{
            answer: 'other_answer',
            image: 'other_image'
          }],
          date: new Date()
        }
      ])

      await surveyResultCollection.insertOne({
        surveyId: surveysInserted.insertedIds[0],
        accountId: account.id,
        answer: 'any_answer',
        date: new Date()
      })

      const sut = makeSut()

      const surveys = await sut.loadAll(account.id)

      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[0].didAnswer).toBe(true)

      expect(surveys[1].question).toBe('other_question')
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should load empty list', async () => {
      const account = await makeAccount()
      const sut = makeSut()

      const surveys = await sut.loadAll(account.id)

      expect(surveys.length).toBe(0)
    })
  })

  describe('LoadById', () => {
    test('Should load survey by id on success', async () => {
      const inserted = await surveyCollection.insertOne(
        {
          question: 'any_question',
          answers: [{
            answer: 'any_answer',
            image: 'any_image'
          }],
          date: new Date()
        }
      )

      const id = inserted.insertedId.toString()

      const sut = makeSut()

      const survey = await sut.loadById(id)

      expect(survey).toBeTruthy()
    })
  })
})
