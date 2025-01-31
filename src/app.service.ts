import { InjectFlowProducer, InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { FlowProducer, Queue } from 'bullmq';

@Injectable()
export class AppService {
  
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
      });
      

    })();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
