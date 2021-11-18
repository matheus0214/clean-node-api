import jwt from 'jsonwebtoken'

import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'access_token'
  }
}))

describe('JWT Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret')

    const spySign = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_id')

    expect(spySign).toBeCalledWith({ id: 'any_id' }, 'secret')
  })

  test('Should return a token on sign success', async () => {
    const sut = new JwtAdapter('secret')

    const token = await sut.encrypt('any_id')

    expect(token).toBe('access_token')
  })
})
