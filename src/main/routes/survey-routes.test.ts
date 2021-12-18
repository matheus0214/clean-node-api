import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

import app from '../config/app'

let surveyCollection

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
  })

  describe('POST /surveys', () => {
    test('Should return 204 on add a new survey', async () => {
      await request(app)
        .post('/api/surveys')
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
})
