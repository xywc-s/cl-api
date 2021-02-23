import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get()
  allKeywords(): any {
    return this.service.getAll();
  }

  @Get('/keyword/:key')
  getDetails(@Param('key') key): Promise<any> {
    return this.service.getDetails(key);
  }

  @Get('/static')
  allStatic(): any{
    return this.service.getStatics()
  }

  @Get('/job')
  allJobs(): any{
    return this.service.getJobs()
  }

  @Post('/job')
  saveJob(@Body() params): any{
    return this.service.saveJob(params)
  }

  @Delete('/job')
  deleteJob(@Query('id') id):any{
    return this.service.deleteJob(id)
  }

  @Put('/job')
  updateJob(@Body() params):any{
    return this.service.updateJob(params)
  }
}
