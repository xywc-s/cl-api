import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbsModule } from './dbs/dbs.module';

@Module({
  imports: [DbsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
