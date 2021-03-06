import bcrypt from 'bcrypt'

import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (data: string | Buffer, saltOrRounds: string | number): Promise<string> {
    return await new Promise(resolve => resolve('hashed_value'))
  },
  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('BCrypt Adapter', () => {
  describe('Hash', () => {
    test('Should call hash with correct values', async () => {
      const sut = makeSut()

      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.hash('any_value')

      expect(hashSpy).toBeCalledWith('any_value', salt)
    })

    test('Should return a valid hash on hash success', async () => {
      const sut = makeSut()

      const hash = await sut.hash('any_value')

      expect(hash).toBe('hashed_value')
    })

    test('Should throw if hash throws', async () => {
      const sut = makeSut()

      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(
        () => {
          throw new Error('')
        }
      )

      const promise = sut.hash('any_value')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('Compare', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut()

      const compareSpy = jest.spyOn(bcrypt, 'compare')

      await sut.compare('any_value', 'any_hash')

      expect(compareSpy).toBeCalledWith('any_value', 'any_hash')
    })

    test('Should return true when compare succeeds', async () => {
      const sut = makeSut()

      const isValid = await sut.compare('any_value', 'any_hash')

      expect(isValid).toBe(true)
    })

    test('Should return false when compare fails', async () => {
      const sut = makeSut()

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(
        () => {
          return false
        }
      )

      const isValid = await sut.compare('any_value', 'any_hash')

      expect(isValid).toBe(false)
    })

    test('Should throw if compare throws', async () => {
      const sut = makeSut()

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(
        () => {
          throw new Error('')
        }
      )

      const promise = sut.compare('any_value', '_any')

      await expect(promise).rejects.toThrow()
    })
  })
})
