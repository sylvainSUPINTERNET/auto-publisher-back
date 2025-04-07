import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Post()
  async create(@Body() createCatDto: any): Promise<string> {
    return 'This action adds a new cat';
  }

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
