import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { ConsumerMagicClip } from './consumers/magic-clip.consumer';
import { Step1Consumer } from './consumers/step1/step1.consumer';
import { Step2Consumer } from './consumers/step2.consumer';
import { Step1EventListener } from './consumers/step1/step1.event-listener';

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
      name: 'magic-clip', //parent queue
    }),
    BullModule.registerQueue({
      name: 'step1',
    }),
    BullModule.registerFlowProducer({
      name: "flow-producer-auto-clip"
    })
  ],
  controllers: [AppController],
  providers: [AppService, ConsumerMagicClip, Step1Consumer, Step2Consumer, Step1EventListener],
})
export class AppModule {}
