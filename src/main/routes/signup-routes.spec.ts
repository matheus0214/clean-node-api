import request from 'supertest'

import app from '../config/app'

describe('SignUpRoutes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Maud Malone',
        email: 'fulfiwbur@vubo.af',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
