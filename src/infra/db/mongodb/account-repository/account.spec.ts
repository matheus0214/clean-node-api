import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

let accountCollection: Collection

describe('Account Mongo Repository', () => {
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

  test('Should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'Maria Weaver',
      email: 'lek@nuc.edu',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('Maria Weaver')
    expect(account.email).toBe('lek@nuc.edu')
    expect(account.password).toBe('any_password')
  })

  test('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()

    await accountCollection.insertOne({
      name: 'Maria Weaver',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    const account = await sut.loadByEmail('any_email@mail.com')

    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe('Maria Weaver')
    expect(account?.email).toBe('any_email@mail.com')
    expect(account?.password).toBe('any_password')
  })

  test('Should return null if loadByEmail not find', async () => {
    const sut = makeSut()

    const account = await sut.loadByEmail('any_email@mail.com')

    expect(account).toBeFalsy()
  })

  test('Should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut()

    const createdAccount = await accountCollection.insertOne({
      name: 'Maria Weaver',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    const find = await accountCollection.findOne({
      _id: createdAccount.insertedId
    })

    expect(find?.accessToken).toBeFalsy()

    await sut.updateAccessToken(createdAccount.insertedId.toString(), 'token')

    const account = await accountCollection.findOne({
      _id: createdAccount.insertedId
    })

    expect(account).toBeTruthy()
    expect(account?.accessToken).toBe('token')
  })
})
