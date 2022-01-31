import { loginPath } from './paths/login-path'
import { signUpPath } from './paths/signup-path'
import { surveyResultPath } from './paths/survey-result-path'
import { surveyPath } from './paths/surveys-path'

export default {
  paths: {
    '/login': loginPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath,
    '/signup': signUpPath
  }
}
