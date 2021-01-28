import { Module } from '@nestjs/common';
import { DB } from './dbs.provider';

@Module({
  providers: [...DB],
  exports: [...DB]
})
export class DbsModule {}
