import { AddSurveyModel, AddSurveyRepository } from '../../../../data/usecases/add-survey/add-survey-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (survey: AddSurveyModel): Promise<void> {
    await (await MongoHelper.getCollection('surveys')).insertOne(survey)
  }
}
