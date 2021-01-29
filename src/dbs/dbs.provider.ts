import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';

export const DB = [{
  provide: 'db',
  useFactory: async (config: ConfigService) => {
    const host = config.get<string>('MongoDB_HOST', 'localhost')
    const port = config.get<number>('MongoDB_PORT', 27017)
    const user = config.get<string>('MongoDB_USER')
    const secret = config.get<string>('MongoDB_SECRET')
    const db = config.get<string>('MongoDB_DB','admin')
    const uri = `mongodb://${user}:${secret}@${host}:${port}/${db}`
    const client = new MongoClient(uri,{
      useUnifiedTopology: true,
      authSource: db
    })
    const connect = await client.connect()
    return connect.db()
  },
  inject: [ConfigService]
},{
  provide: 'redis',
  useFactory: ()=>{

  }
}]
