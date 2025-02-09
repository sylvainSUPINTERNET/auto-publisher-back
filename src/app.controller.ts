import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return "hello";
  }


  @Get("/hello")
  getHello2(): string {
    this.appService.getHello();
    return "hello2"
  }
}
