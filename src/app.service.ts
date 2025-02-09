import { InjectFlowProducer } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { FlowOpts, FlowProducer } from 'bullmq';
const { v4: uuidv4 } = require('uuid');

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  
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
      "step3": {
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      },
      "step4": {
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      }
    },
  };
  
  constructor(
    // @InjectQueue("magic-clip") private autoClipQueue: Queue, 
    @InjectFlowProducer("flow-producer-auto-clip") private flowProducer: FlowProducer) 
    {

    // ( async () => {


    //   const jobUUID = uuidv4();
    //   this.logger.log(`New jobUUID : ${jobUUID}`);
    //   const job = await this.flowProducer.add({
    //     name: 'job-magic-clip',
    //     queueName: 'magic-clip',
    //     data: {
    //       step: 'End',
    //       foo: 'bar'
    //     },
    //     children: [ // can use different queue for children to execute in parallel
    //       {
    //         name: "step4",
    //         queueName: "step4",
    //         data: {
    //           jobUUID
    //         },
    //         children: [
    //           {
    //             name: "step3",
    //             queueName: "step3",
    //             data: {
    //               jobUUID
    //             },
    //             children: [
    //               {
    //                 name: "step2",
    //                 queueName: 'step2',
    //                 data: {
    //                   jobUUID
    //                 },
    //                 children: [
    //                   {
    //                     name: "step1",
    //                     queueName: 'step1',
    //                     data: {
    //                       jobUUID
    //                     }
    //                   }
    //                 ]
    //               }
    //             ]
    //           }
    //         ]
    //       }
    //     ],
    //   }, 
    //   this.flowOpts);
      

    // })();
  }

  async getHello() {
    const jobUUID = uuidv4();
    this.logger.log(`New jobUUID : ${jobUUID}`);
    const job = await this.flowProducer.add({
      name: 'job-magic-clip',
      queueName: 'magic-clip',
      data: {
        step: 'End',
        foo: 'bar'
      },
      children: [ // can use different queue for children to execute in parallel
        {
          name: "step4",
          queueName: "step4",
          data: {
            jobUUID
          },
          children: [
            {
              name: "step3",
              queueName: "step3",
              data: {
                jobUUID
              },
              children: [
                {
                  name: "step2",
                  queueName: 'step2',
                  data: {
                    jobUUID
                  },
                  children: [
                    {
                      name: "step1",
                      queueName: 'step1',
                      data: {
                        jobUUID
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
    }, 
    this.flowOpts);
    


  }
}
