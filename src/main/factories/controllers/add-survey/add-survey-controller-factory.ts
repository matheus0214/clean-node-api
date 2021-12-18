
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { AddSurveyController } from '../../../../presentation/controllers/survey/add-servey/add-survey-controller'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { makeDbAddSurvey } from '../../usecases/add-survey/db-add-survey-factory'

export const makeAddSurveyController = (): Controller => {
  const validation = makeAddSurveyValidation()

  const controller = new AddSurveyController(validation, makeDbAddSurvey())
  return makeLogControllerDecorator(controller)
}
