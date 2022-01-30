export const badRequestComponent = {
  description: 'Bad Request',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
