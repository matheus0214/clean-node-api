export const loginParamsSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    }
  }
}