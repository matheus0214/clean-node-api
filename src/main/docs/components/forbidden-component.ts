export const forbiddenComponent = {
  description: 'No Access',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
