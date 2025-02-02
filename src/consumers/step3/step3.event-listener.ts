import {
    QueueEventsListener,
    QueueEventsHost,
    OnQueueEvent,
  } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { STEPS } from '../constant';
  
  @QueueEventsListener('step3')
  export class Step3EventListener extends QueueEventsHost {
    
    private readonly logger = new Logger(Step3EventListener.name);
    private readonly STEP1 = STEPS["3"];

    @OnQueueEvent('waiting')
    onWaiting({ jobId, }: { jobId: string; }) {
    }


    @OnQueueEvent('progress')
    onProgress({ jobId, }: { jobId: string; }) {
    }

    @OnQueueEvent('completed')
    onCompleted({jobId,}: {jobId: string;returnvalue: string;prev?: string;}) {
      this.logger.log(`${this.STEP1.LOG_PREFIX} completed ${jobId}`);
    }

    @OnQueueEvent('failed')
    onFailed({jobId,}: {jobId: string;returnvalue: string;prev?: string;}) {
      this.logger.log(`${this.STEP1.LOG_PREFIX} failed ${jobId}`);
    }
  }