import { InjectFlowProducer } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { FlowOpts, FlowProducer } from 'bullmq';
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

@Injectable()
export class AppService {

  private flowOpts: FlowOpts = {
    queuesOptions: {
      'magic-clip': {
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      },
      "step1": {
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      },
      "step2": {
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      },
    },
  };
  
  constructor(
    // @InjectQueue("magic-clip") private autoClipQueue: Queue, 
    @InjectFlowProducer("flow-producer-auto-clip") private flowProducer: FlowProducer) 
    {

    ( async () => {

      const job = await this.flowProducer.add({
        name: 'job-magic-clip',
        queueName: 'magic-clip',
        data: {
          step: 'End',
          foo: 'bar'
        },
        children: [ // can use different queue for children to execute in parallel
          {
            name: "step2",
            queueName: 'step2',
            children: [
              {
                name: "step1",
                queueName: 'step1'
              }
            ]
          }
        ],
      }, 
      this.flowOpts);
      

    })();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
