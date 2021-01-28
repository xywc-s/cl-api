import { MongoClient } from 'mongodb';

const uri = 'mongodb://etfun:Vzgc7tJ3@129.28.160.9:27017/mercador'

const options = {
  useUnifiedTopology: true,
  authSource: 'mercador'
}

export const DB = [{
  provide: 'db',
  useFactory: async () => {
    const connect = await MongoClient.connect(uri, options)
    return connect.db()
  }
},{
  provide: 'redis',
  useFactory: ()=>{

  }
}]
