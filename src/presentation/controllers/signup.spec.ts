import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'takbezjaf@ro.hk',
        password: 'hy6YJ4o5Ep65fLpSUjY',
        passwordConfirmation: 'hy6YJ4o5Ep65fLpSUjY'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  })

  test('Should return 400 if no email is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'Raymond Guerrero',
        password: 'hy6YJ4o5Ep65fLpSUjY',
        passwordConfirmation: 'hy6YJ4o5Ep65fLpSUjY'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: email'))
  })
})
