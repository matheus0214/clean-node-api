
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { AddSurveyController } from '@/presentation/controllers/survey/add-servey/add-survey-controller'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { makeDbAddSurvey } from '@/main/factories/usecases/survey/add-survey/db-add-survey-factory'

export const makeAddSurveyController = (): Controller => {
  const validation = makeAddSurveyValidation()

  const controller = new AddSurveyController(validation, makeDbAddSurvey())
  return makeLogControllerDecorator(controller)
}
