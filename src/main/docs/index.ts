import {
  badRequestComponent,
  forbiddenComponent,
  notFoundComponent,
  serverErrorComponent,
  unauthorizedComponent
} from './components'
import { loginPath } from './paths/login-path'
import { signUpPath } from './paths/signup-path'
import { surveyResultPath } from './paths/survey-result-path'
import { surveyPath } from './paths/surveys-path'
import {
  accountSchema,
  apiKeyAuthSchema,
  errorSchema,
  loginParamsSchema,
  signUpParamsSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema,
  addSurveyParamsSchema,
  saveSurveyParamsSchema,
  surveyResultSchema
} from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API do curso do Mango',
    version: '1.0.0'
  },
  license: {
    name: 'GPL',
    url: ''
  },
  servers: [
    { url: '/api' }
  ],
  tags: [
    { name: 'Login' },
    { name: 'Survey' }
  ],
  paths: {
    '/login': loginPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath,
    '/signup': signUpPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    signUpParams: signUpParamsSchema,
    error: errorSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema,
    addSurveyParams: addSurveyParamsSchema,
    saveSurveyParams: saveSurveyParamsSchema,
    surveyResult: surveyResultSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest: badRequestComponent,
    serverError: serverErrorComponent,
    unauthorized: unauthorizedComponent,
    notFound: notFoundComponent,
    forbidden: forbiddenComponent
  }
}
