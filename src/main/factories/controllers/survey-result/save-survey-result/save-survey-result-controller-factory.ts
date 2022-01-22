
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

import {
  SaveSurveyResultController
} from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import {
  makeDbSaveSurveyResultFactory
} from '@/main/factories/usecases/survey-result/save-survey-result/db-save-survey-result-factory'
import {
  makeDbLoadSurveyByIdFactory
} from '@/main/factories/usecases/survey-result/load-survey-by-id/db-load-survey-by-id-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadSurveyByIdFactory(), makeDbSaveSurveyResultFactory())
  return makeLogControllerDecorator(controller)
}
