import {
    QueueEventsListener,
    QueueEventsHost,
    OnQueueEvent,
  } from '@nestjs/bullmq';
  
  @QueueEventsListener('step2')
  export class Step2EventListener extends QueueEventsHost {

    @OnQueueEvent('progress')
    onProgress({ jobId, }: { jobId: string; }) {
      console.log("STEP 2LISTENER PROGRESS", jobId);
    }


    @OnQueueEvent('waiting')
    onWaiting({ jobId, }: { jobId: string; }) {
      console.log("STEP 2LISTENER WAITING", jobId);
    }

    @OnQueueEvent('completed')
    onCompleted({jobId,}: {jobId: string;returnvalue: string;prev?: string;}) {
      console.log("STEP 2LISTENER COMPLETED", jobId);
    }
  }