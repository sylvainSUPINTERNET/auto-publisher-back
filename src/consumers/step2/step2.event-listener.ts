import {
    QueueEventsListener,
    QueueEventsHost,
    OnQueueEvent,
  } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { STEPS } from '../constant';
  
  @QueueEventsListener('step2')
  export class Step2EventListener extends QueueEventsHost {

    private readonly logger = new Logger(Step2EventListener.name);
    private readonly STEP2 = STEPS["2"];

    @OnQueueEvent('waiting')
    onWaiting({ jobId, }: { jobId: string; }) {
    }

    @OnQueueEvent('progress')
    onProgress({ jobId, }: { jobId: string; }) {
    }

    @OnQueueEvent('completed')
    onCompleted({jobId,}: {jobId: string;returnvalue: string;prev?: string;}) {
      this.logger.log(`${this.STEP2.LOG_PREFIX} completed ${jobId}`);
    }

    @OnQueueEvent('failed')
    onFailed({jobId,}: {jobId: string;returnvalue: string;prev?: string;}) {
      this.logger.log(`${this.STEP2.LOG_PREFIX} failed ${jobId}`);
    }
  }