export const surveyResultPath = {
  put: {
    tags: ['Survey'],
    summary: 'API para criar resposta de uma enquente',
    security: [{ apiKeyAuth: [] }],
    parameters: {
      in: 'path',
      name: 'surveyId',
      required: true,
      schema: {
        type: 'string'
      }
    },
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveSurveyParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Successful',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult'
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
  },
  get: {
    tags: ['Survey'],
    summary: 'API para carregar resposta de uma enquente',
    security: [{ apiKeyAuth: [] }],
    parameters: {
      in: 'path',
      name: 'surveyId',
      required: true,
      schema: {
        type: 'string'
      }
    },
    responses: {
      200: {
        description: 'Successful',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult'
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
