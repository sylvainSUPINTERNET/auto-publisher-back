// import { Test, TestingModule } from '@nestjs/testing';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

const fs = require('fs');
const path = require('path');

describe('AppController', () => {

  it('step4.consumer', async() => {
    const fixtureCompletion = fs.readFileSync(path.resolve(process.cwd(),"fixtures", "completion.json"), 'utf8');
    console.log(fixtureCompletion)
  });
  // let appController: AppController;

  // beforeEach(async () => {
  //   const app: TestingModule = await Test.createTestingModule({
  //     controllers: [AppController],
  //     providers: [AppService],
  //   }).compile();

  //   appController = app.get<AppController>(AppController);
  // });

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(appController.getHello()).toBe('Hello World!');
  //   });
  // });
});
