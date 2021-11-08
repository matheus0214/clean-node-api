import { Request, Response, Handler } from 'express'

import { Controller, HttpRequest } from '../../presentation/protocols'

export const adaptRoute = (controller: Controller): Handler => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }

    const httpResponse = await controller.handle(httpRequest)

    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
