import request from 'supertest'
import { sign } from 'jsonwebtoken'

import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import env from '../config/env'
import app from '../config/app'
import { ObjectId } from 'mongodb'

let surveyCollection
let accountCollection

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

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'this is a question',
          answers: [{
            answer: 'any_answer',
            image: 'any_image'
          }]
        })
        .expect(403)
    })

    test('Should return 204 on add survey with valid token', async () => {
      const user = await accountCollection.insertOne({
        email: 'fulfiwbur@vubo.af',
        password: 'any',
        name: 'Viola Park',
        role: 'admin'
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

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'this is a question',
          answers: [{
            answer: 'any_answer',
            image: 'any_image'
          }]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load survey without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 200 on load surveys with valid token', async () => {
      const user = await accountCollection.insertOne({
        email: 'fulfiwbur@vubo.af',
        password: 'any',
        name: 'Viola Park',
        role: 'user'
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

      await surveyCollection.insertMany([
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

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
