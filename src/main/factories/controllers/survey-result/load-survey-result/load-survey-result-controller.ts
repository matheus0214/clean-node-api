
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

import {
  makeDbLoadSurveyByIdFactory
} from '@/main/factories/usecases/survey-result/load-survey-by-id/db-load-survey-by-id-factory'
import {
  LoadSurveyResultController
} from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import {
  makeDbLoadSurveyResultFactory
} from '@/main/factories/usecases/survey-result/load-survey-result/db-load-survey-factory'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbLoadSurveyByIdFactory(), makeDbLoadSurveyResultFactory())
  return makeLogControllerDecorator(controller)
}
