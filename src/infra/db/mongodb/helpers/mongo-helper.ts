import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,
  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(process.env.MONGO_URL ?? uri)
    await MongoClient.connect(process.env.MONGO_URL ?? uri)
  },
  async disconnect () {
    await this.client.close()
    this.client = null
  },
  async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri)
    }

    return this.client.db().collection(name)
  },
  map (collection: any): any {
    const { _id, ...obj } = collection

    return Object.assign({}, obj, { id: _id })
  }
}
