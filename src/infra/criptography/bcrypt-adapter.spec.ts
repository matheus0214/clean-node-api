import bcrypt from 'bcrypt'

import { BcryptAdapter } from './bcrypt-adapter'

describe('BCrypt Adapter', () => {
  test('Should call bcrypt with crrect values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')

    expect(hashSpy).toBeCalledWith('any_value', salt)
  })
})
