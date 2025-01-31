import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class AppService {
  
  constructor(@InjectQueue("auto-clip") private autoClipQueue: Queue) {
    ( async () => {
      
      await this.autoClipQueue.add('audio-clip', {
        myData:"kekw"
      });
    })();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
