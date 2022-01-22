import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { Collection, ObjectId } from 'mongodb'

import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import env from '../config/env'
import app from '../config/app'
import { SurveyModel } from '@/domain/models/survey'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (role: string): Promise<string> => {
  const user = await accountCollection.insertOne({
    email: 'fulfiwbur@vubo.af',
    password: 'any',
    name: 'Viola Park',
    role
  })

  const id = String(user.insertedId)

  const accessToken = sign({ id }, env.jwtSecret)

  await accountCollection.updateOne({
    _id: new ObjectId(id)
  }, {
    $set: {
      accessToken
    }
  })

  return accessToken
}

const makeFakeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer'
      }
    ],
    date: new Date()
  })

  const survey = await surveyCollection.findOne({
    _id: new ObjectId(res.insertedId)
  })

  return MongoHelper.map(survey)
}

describe('SurveyRoutes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__ ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save survey result with accessToken', async () => {
      const survey = await makeFakeSurvey()
      const accessToken = await makeAccessToken('admin')
      await request(app)
        .put(`/api/surveys/${survey.id.toString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any_answer'
        })
        .expect(200)
    })
  })
})
