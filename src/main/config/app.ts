import express from 'express'

import setUpStaticFiles from './static-files'
import setUpMiddlewares from './middlewares'
import setUpRoutes from './routes'
import setUpSwagger from './config-swagger'

const app = express()

setUpStaticFiles(app)
setUpSwagger(app)
setUpMiddlewares(app)
setUpRoutes(app)

export default app
