import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/update-access-token-repository'
import { AccountModel } from '../../../../domain/models'
import { AddAccountModel } from '../../../../domain/usecases'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository
implements
AddAccountRepository,
LoadAccountByEmailRepository,
UpdateAccessTokenRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const insertedId = (await accountCollection.insertOne(account)).insertedId

    const newAccount = await accountCollection.findOne(insertedId)

    return MongoHelper.map(newAccount)
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })

    return account ? MongoHelper.map(account) : null
  }

  async updateAccessToken (data: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.updateOne({ _id: new ObjectId(data) }, { $set: { accessToken: token } })
  }
}
