import { badRequestComponent } from './components/bad-request-component'
import { forbiddenComponent } from './components/forbidden-component'
import { notFoundComponent } from './components/not-found-component'
import { serverErrorComponent } from './components/server-error-component'
import { unauthorizedComponent } from './components/unauthorized-component'
import { loginPath } from './paths/login-path'
import { surveyPath } from './paths/surveys-path'
import { accountSchema } from './schemas/account-schema'
import { apiKeyAuthSchema } from './schemas/api-key-auth-schema'
import { errorSchema } from './schemas/error-schema'
import { loginParamsSchema } from './schemas/login-params-schema '
import { surveyAnswerSchema } from './schemas/survey-answer-schema'
import { surveySchema } from './schemas/survey-schema'
import { surveysSchema } from './schemas/surveys-schema'

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
    '/surveys': surveyPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema
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
