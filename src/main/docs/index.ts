import paths from './paths'
import components from './components'

import schemas from './schemas'

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
    { name: 'Login' },
    { name: 'Survey' }
  ],
  paths,
  schemas,
  components
}
