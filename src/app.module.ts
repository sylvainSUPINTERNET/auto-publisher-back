import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { ConsumerMagicClip } from './consumers/magic-clip.consumer';
import { Step1Consumer } from './consumers/step1/step1.consumer';
import { Step2Consumer } from './consumers/step2/step2.consumer';
import { Step1EventListener } from './consumers/step1/step1.event-listener';
import { RedisModule } from './redis/redis.module';
import { Step2EventListener } from './consumers/step2/step2.event-listener';
import { Step3EventListener } from './consumers/step3/step3.event-listener';
import { Step4EventListener } from './consumers/step4/step4.event-listener';
import { Step3Consumer } from './consumers/step3/step3.consumer';
import { Step4Consumer } from './consumers/step4/step4.consumer';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsModule } from './jobs/jobs.module';
import { YtbService } from './services/YtbService';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_CONNECTION_STRING as string,
        port: process.env.REDIS_PORT as unknown as number,
        username: process.env.REDIS_USERNAME as string,
        password: process.env.REDIS_PASSWORD as string,
      },
    }),
    BullModule.registerQueue({
      name: 'magic-clip', //parent queue
    }),
    // BullModule.registerQueue({
    //   name: 'step1',
    // }),
    BullModule.registerFlowProducer({
      name: "flow-producer-auto-clip",
    }),
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING as string),
    JobsModule
  ],
  controllers: [AppController],
  providers: [AppService, 
    ConsumerMagicClip,
    Step1Consumer,
    Step2Consumer,
    Step3Consumer,
    Step4Consumer,
    Step1EventListener, 
    Step2EventListener,
    Step3EventListener,
    Step4EventListener,
    YtbService
  ],
})
export class AppModule {}
