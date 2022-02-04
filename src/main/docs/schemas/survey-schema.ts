export const surveySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    question: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveAnswer'
      }
    },
    date: {
      type: 'string'
    },
    didAnswer: {
      type: 'boolean'
    }
  }
}
