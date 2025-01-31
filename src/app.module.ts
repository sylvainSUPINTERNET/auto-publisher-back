import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_CONNECTION_STRING as string,
        port: 6379,
        username: process.env.REDIS_USERNAME as string,
        password: process.env.REDIS_PASSWORD as string,
      },
    }),
    BullModule.registerQueue({
      name: 'auto-clip',
    }),
    BullModule.registerFlowProducer({
      name: "flow-producer-auto-publisher"
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
