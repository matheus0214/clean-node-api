import jwt from 'jsonwebtoken'

import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'access_token'
  },

  verify (): string {
    return 'access_token'
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JWT Adapter', () => {
  describe('Sign', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()

      const spySign = jest.spyOn(jwt, 'sign')

      await sut.encrypt('any_id')

      expect(spySign).toBeCalledWith({ id: 'any_id' }, 'secret')
    })

    test('Should return a token on sign success', async () => {
      const sut = makeSut()

      const token = await sut.encrypt('any_id')

      expect(token).toBe('access_token')
    })

    test('Should thorw if sign throws', async () => {
      const sut = makeSut()

      jest.spyOn(jwt, 'sign').mockImplementationOnce(
        () => {
          throw new Error()
        }
      )

      const promise = sut.encrypt('any_id')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('Verify', () => {
    test('Should call verify with correct values', async () => {
      const sut = makeSut()

      const spyVerify = jest.spyOn(jwt, 'verify')

      await sut.decrypt('any_token')

      expect(spyVerify).toBeCalledWith('any_token', 'secret')
    })

    test('Should return a value on verify success', async () => {
      const sut = makeSut()

      const value = await sut.decrypt('any_token')

      expect(value).toBe('access_token')
    })

    test('Should throw if verify throws', async () => {
      const sut = makeSut()

      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error('')
      })

      const promise = sut.decrypt('any_token')

      await expect(promise).rejects.toThrow()
    })
  })
})
