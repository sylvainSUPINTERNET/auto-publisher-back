import {
    QueueEventsListener,
    QueueEventsHost,
    OnQueueEvent,
  } from '@nestjs/bullmq';
import { STEPS } from '../constant';
import { Logger } from '@nestjs/common';
  
  @QueueEventsListener('step4')
  export class Step4EventListener extends QueueEventsHost {

    private readonly logger = new Logger(Step4EventListener.name);
    private readonly STEP1 = STEPS["4"];

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