import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { AddSurveyModel, AddSurveyRepository } from '@/data/usecases/survey/add-survey/add-survey-protocols'
import { LoadSurveyByIdRepository } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { SurveyModel } from '@/domain/models/survey'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements
  AddSurveyRepository,
  LoadSurveysRepository,
  LoadSurveyByIdRepository {
  async add (survey: AddSurveyModel): Promise<void> {
    await (await MongoHelper.getCollection('surveys')).insertOne(survey)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveys = await (await MongoHelper.getCollection('surveys')).find().toArray()

    return MongoHelper.mapArrayCollection(surveys)
  }

  async loadById (id: string): Promise<SurveyModel | undefined> {
    const collection = await MongoHelper.getCollection('surveys')
    const result = await collection.findOne({ _id: new ObjectId(id) })

    if (result) {
      return MongoHelper.map(result)
    }

    return undefined
  }
}
