import request from 'supertest'
import { hash } from 'bcrypt'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

import app from '../config/app'

let accountCollection

describe('LoginRoutes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__ ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 201 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Maud Malone',
          email: 'fulfiwbur@vubo.af',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(201)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      jest.setTimeout(90000)
      const hashedPassword = await hash('123', 12)
      await accountCollection.insertOne({
        email: 'fulfiwbur@vubo.af',
        password: hashedPassword,
        name: 'Viola Park'
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'fulfiwbur@vubo.af',
          password: '123'
        })
        .expect(200)
    })

    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'fulfiwbur@vubo.af',
          password: '123'
        })
        .expect(401)
    })
  })
})
