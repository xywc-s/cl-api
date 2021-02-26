import { Inject, Injectable } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import Service from 'src/base/service';
@Injectable()
export class AppService extends Service {
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
            $push: '$img'
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
          trend: {
            $push: '$sales'
          }
        }
      },
      {
        $set:{
          img: {
            $filter: {
              input: '$img',
              cond: {
                $regexFind: {
                  input: '$$this',
                  regex: /^http/
                } 
              }
            }
          }
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

  async getJobs(): Promise<any>{
    const jobs = await this.db.collection('jobs').find({}).sort('created_at', -1).toArray()
    return {
      code: 200,
      data: jobs
    }
  }

  async saveJob(params: any): Promise<any>{
    let job = Object.assign({}, params)
    job.status = 0
    job.progress = 0
    job.created_at = new Date().valueOf()
    await this.db.collection('jobs').insertOne(job)
    return {
      code: 200,
      message: '添加成功',
      data: [job]
    }
  }

  async deleteJob(id: string): Promise<any>{
    try {
      let job = await this.db.collection('jobs').findOneAndDelete({_id: new ObjectId(id)})
      return this.successResponse('删除成功！')
    } catch (error) {
      return this.errorResponse(error)
    }
  }

  async updateJob(params: any): Promise<any>{
    try {
      let job = await this.db.collection('jobs').findOne({_id: new ObjectId(params._id)})
      console.log(job);
      job.progress++
      if(job.progress === job.cycle) job.status = 2;
      else job.status = 1
      console.log(job);
      await this.db.collection('jobs').findOneAndReplace({_id: new ObjectId(params._id)}, job)
      return this.successResponse('更新成功！')
    } catch (error) {
      return this.errorResponse(error)
    }
  }
}
