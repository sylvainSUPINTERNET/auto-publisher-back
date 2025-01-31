import {
    QueueEventsListener,
    QueueEventsHost,
    OnQueueEvent,
  } from '@nestjs/bullmq';
  
  @QueueEventsListener('step1')
  export class Step1EventListener extends QueueEventsHost {

    @OnQueueEvent('progress')
    onProgress({ jobId, }: { jobId: string; }) {
      console.log("STEP 1 LISTENER PROGRESS", jobId);
    }


    @OnQueueEvent('waiting')
    onWaiting({ jobId, }: { jobId: string; }) {
      console.log("STEP 1 LISTENER WAITING", jobId);
    }

    @OnQueueEvent('completed')
    onCompleted({jobId,}: {jobId: string;returnvalue: string;prev?: string;}) {
      console.log("STEP 1 LISTENER COMPLETED", jobId);
    }
  }