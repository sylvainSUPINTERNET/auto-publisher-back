



```` bash

0:v → Vidéo de la première entrée (0).
1:v → Vidéo de la deuxième entrée (1) (ex: une image superposée).
0:a → Audio de la première entrée (0).
1:a → Audio de la deuxième entrée (1).

ffmpeg -f lavfi -i color=c=white:s=1280x720:d=10 -i alien_emoji.png -filter_complex "
[0:v]
drawtext=fontfile='C\:/Workspace/\perso/\auto-publisher-back/\assets/\the_bold_font.ttf': text='SUPER': fontcolor=white: fontsize=80: x=(w-text_w)/2: y=h-text_h-200: enable='between(t,1,3)': box=1: boxcolor=black@1: boxborderw=10[super];
[super]drawtext=fontfile='C\:/Workspace/\perso/\auto-publisher-back/\assets/\the_bold_font.ttf': text='SUPER': fontcolor=black: fontsize=80: x=(w-text_w)/2: y=h-text_h-200: enable='between(t,3,5)': box=1: boxcolor=orange@1: boxborderw=10;" -t 5 -y output.mp4

# recommended ( complex filter )
ffmpeg -f lavfi -i color=c=white:s=1280x720:d=10 -i alien_emoji.png -filter_complex "
[0:v]
drawtext=fontfile='C\:/Windows/\Fonts/\seguiemj.ttf': text='🔥 SUPER': fontcolor=white: fontsize=80: x=(w-text_w)/2: y=h-text_h-200: enable='between(t,1,3)': box=1: boxcolor=black@1: boxborderw=10[super];
[super]drawtext=fontfile='C\:/Windows/\Fonts/\seguiemj.ttf': text='🔥 Kekw': fontcolor=yellow: fontsize=80: x=(w-text_w)/2: y=h-text_h-200: enable='between(t,3,5)': box=1: boxcolor=red@1: boxborderw=10[kekw];
[kekw][1:v] overlay=x=(W-w)/4:y=600:enable='between(t,4,4)'[final]" -map "[final]" -t 5 -y output.mp4



# debug 
ffmpeg -f lavfi -i color=c=white:s=1280x720:d=10 -i alien_emoji.png -vf "
drawtext=fontfile='C\:/\Windows/\Fonts/\seguiemj.ttf': text='🔥 Super': fontcolor=yellow: fontsize=80: x=(w-text_w)/2: y=h-text_h-100: enable='between(t,1,3)': box=1: boxcolor=black@0.6: boxborderw=10,
drawtext=fontfile='C\:/\Windows/\Fonts/\seguiemj.ttf': text='🔥 Kekw': fontcolor=yellow: fontsize=80: x=(w-text_w)/2: y=h-text_h-100: enable='between(t,3,5)': box=1: boxcolor=red@1: boxborderw=10" -t 5 -y output.mp4


# zoom in ease : fontsize=20+60*sin(3.14*t/2)


ffmpeg -ss 00:00:10 -t 5 -i "Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).webm" -vf "drawtext=fontfile='C\:/\Windows/\Fonts/\arial.ttf': text='🔥 Super sous-titre 🔥': fontcolor=yellow: fontsize=80: x=(w-text_w)/2: y=h-text_h-100+10*sin(2*3.14*3*t): enable='between(t,1,3)': box=1: boxcolor=red@1: boxborderw=10" -c:a copy output.webm



ffmpeg -ss 00:00:10 -t 5 -i "Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).webm" -vf "drawtext=fontfile='C\:/\Windows/\Fonts/\arial.ttf': text='🔥 Super sous-titre 🔥': fontcolor=yellow: fontsize=80: x=(w-text_w)/2: y=h-text_h-100+10*sin(2*3.14*3*t): enable='between(t,1,3)': box=1: boxcolor=red@1: boxborderw=10: ,fade=t=in:st=0:d=2" -c:a copy output.webm

 ffmpeg -ss 00:00:10 -t 5 -i "Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).webm" -vf "drawtext=fontfile='C\:/\Windows/\Fonts/\arial.ttf': text='🔥 Super sous-titre 🔥': fontcolor=yellow: fontsize=80: x=(w-text_w)/2: y=h-text_h-100+10*sin(2*3.14*3*t): enable='between(t,1,3)': box=1: boxcolor=red@1: boxborderw=10: shadowx=5: shadowy=5: shadowcolor=black@0.7: " -c:a copy output.webm

 ffmpeg -ss 00:00:10 -t 5 -i "Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).webm" -vf "drawtext=fontfile='C\:/\Windows/\Fonts/\arial.ttf': text='🔥 Super sous-titre 🔥': fontcolor=yellow: fontsize=80: x=(w-text_w)/2: y=h-100-(h/2+text_h)*sin((t/2)*3.14/2): enable='between(t,1,3)': box=1: boxcolor=red@1: boxborderw=10: shadowx=5: shadowy=5: shadowcolor=black@0.7: " -c:a copy output.webm


 # chain 

 ffmpeg -i input.webm -vf "
drawtext=fontfile='C\:/\Windows/\Fonts/\arial.ttf': text='🔥 Super': fontcolor=yellow: fontsize=80: x=(w-text_w)/2: y=h-text_h-100: enable='between(t,1,3)', 
drawtext=fontfile='C\:/\Windows/\Fonts/\arial.ttf': text='Sous-titre 🔥': fontcolor=yellow: fontsize=80: x=(w-text_w)/2: y=h-text_h-100: enable='between(t,3,5)'" -c:a copy output.webm


````	

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
