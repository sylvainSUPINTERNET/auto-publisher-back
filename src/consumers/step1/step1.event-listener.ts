import {
    QueueEventsListener,
    QueueEventsHost,
    OnQueueEvent,
  } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { STEPS } from '../constant';
  
  @QueueEventsListener('step1')
  export class Step1EventListener extends QueueEventsHost {

    private readonly logger = new Logger(Step1EventListener.name);
    private readonly STEP1 = STEPS["1"];

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