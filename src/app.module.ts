import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbsModule } from './dbs/dbs.module';

@Module({
  imports: [
    DbsModule,
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
