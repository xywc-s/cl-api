import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
@Injectable()
export class AppService {
  @Inject('db')
  private db:Db

  async getAll(): Promise<any> {
    let cols = await this.db.listCollections({
      name: {
        $regex: '^kw'
      }
    },{
      nameOnly: true
    }).toArray()
    const data = []
    for (const col of cols) {
      let name = col.name
      let keyword = name.replace('kw-','').replace(/-/g,' ')
      let res = await this.db.collection(name).aggregate([
        {
          $match: { 'sales':{ '$gt': 0} },
        },{
          $group: { _id: '$pid'}
        }
      ]).toArray()
      let counts = res? res.length:0
      res = await this.db.collection(name).aggregate([
        {
          $match: { 'sales':{ '$gt': 0} },
        },{
          $group: { 
            _id: null, 
            'start_date':  {$min: '$created_at'},
            'end_date': {$max: '$created_at'}
          }
        }
      ]).toArray()
      let start_date = res ? res[0].start_date: null
      let end_date = res ? res[0].end_date: null
      data.push({name,keyword, counts, start_date, end_date})
    }
    return {
      code: 200,
      data
    }
  }

  async getDetails(key): Promise<any>{
    const data = await this.db.collection(key).aggregate([
      {
        $match: { 'sales': { '$gt': 0}}
      },
      {
        $group: {
          _id: '$pid',
          img: {
            $first: '$img'
          },
          src: {
            $first: '$src'
          },
          start_date: {
            $first: '$created_at'
          },
          end_date: {
            $last: '$created_at'
          },
          start_sale: {
            $first: '$sales'
          },
          end_sale: {
            $last: '$sales'
          },
        }
      }
    ]).toArray()
    return {
      code: 200,
      data
    }
  }

  async getStatics(): Promise<any>{
    let data = await this.db.listCollections({
      name: {
        $regex: '^kw'
      }
    },{
      nameOnly: true
    }).toArray()
    return {
      code:200,
      data
    }
  }
}
