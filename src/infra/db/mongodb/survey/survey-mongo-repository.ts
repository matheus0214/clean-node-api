import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository'
import { AddSurveyModel, AddSurveyRepository } from '../../../../data/usecases/add-survey/add-survey-protocols'
import { SurveyModel } from '../../../../domain/models/survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (survey: AddSurveyModel): Promise<void> {
    await (await MongoHelper.getCollection('surveys')).insertOne(survey)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveys = await (await MongoHelper.getCollection('surveys')).find().toArray()

    return surveys.map(s => MongoHelper.map(s))
  }
}
