export const signUpParamsSchema = {
  type: 'object',
  required: ['name', 'email', 'password', 'passowrdConfirmation'],
  properties: {
    name: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    passwordConfirmation: {
      type: 'string'
    }
  }
}
