import { badRequestComponent } from './components/bad-request-component'
import { notFoundComponent } from './components/not-found-component'
import { serverErrorComponent } from './components/server-error-component'
import { unauthorizedComponent } from './components/unauthorized-component'
import { loginPath } from './paths/login-path'
import { accountSchema } from './schemas/account-schema'
import { errorSchema } from './schemas/error-schema'
import { loginParamsSchema } from './schemas/login-params-schema '

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
    { name: 'Login' }
  ],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest: badRequestComponent,
    serverError: serverErrorComponent,
    unauthorized: unauthorizedComponent,
    notFound: notFoundComponent
  }
}
