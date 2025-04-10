import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { checkSetup } from './utils';


async function bootstrap() {

  try {

    // Check if yt-dlp is installed and available in the PATH
    await checkSetup();
    
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
  } catch ( e ) {
    console.error("Error detected in bootstrap", e.message);
    console.log("Did you install yt-dlp and make it accessible in PATH ?");
  }

}
bootstrap();
