export const surveyPath = {
  get: {
    tags: ['Survey'],
    summary: 'API para list enquetes',
    security: [{ apiKeyAuth: [] }],
    responses: {
      200: {
        description: 'Successful',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
