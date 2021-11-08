import request from 'supertest'

import app from '../config/app'

describe('Content Type middleware', () => {
  test('Should should return default content type as json', async () => {
    app.get('/test_content', (req, res) => {
      res.send('')
    })

    await request(app)
      .get('/test_content')
      .expect('content-type', /json/)
  })

  test('Should should return xml content type when forced', async () => {
    app.get('/test_content_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get('/test_content_xml')
      .expect('content-type', /xml/)
  })
})
