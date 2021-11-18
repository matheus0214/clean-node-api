import jwt from 'jsonwebtoken'

import { JwtAdapter } from './jwt-adapter'

describe('JWT Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret')

    const spySign = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_id')

    expect(spySign).toBeCalledWith({ id: 'any_id' }, 'secret')
  })
})
