import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models'
import { AddAccountModel } from '../../../../domain/usecases'
import { MongoHelper } from '../helpers/mongo-helper'

interface DocumentDatas extends AccountModel {
  _id: string
}

export class AccountMongoRepository implements AddAccountRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')

    const insertedId = (await accountCollection.insertOne(account)).insertedId

    const newAccount = await accountCollection.findOne(insertedId) as DocumentDatas
    const { _id, ...obj } = newAccount

    return Object.assign({}, obj, { id: _id })
  }
}
