import { Controller, Get, Inject, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('GREETER_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/gretting-by-event')
  callWorkerEventPattern() {
    console.log('Sending job to event worker');
    this.client.emit('greeting-event-pattern', 'jhonny');
    return 'Job sent!';
  }

  @Get('/gretting-by-message')
  async callWorkerMessagePattern(@Res() res: Response) {
    console.log('Sending job to message worker');
    const pattern = { cmd: 'greeting-message-pattern' };
    const payload = 'Jhonny';
    return this.client.send(pattern, payload).subscribe({
      next: (data) => {
        console.log(data);
        return res.send(data);
      },
      error: (error) => {
        console.log(error);
        return res.send(error);
      },
      complete: () => console.log('Completed job'),
    });
  }
}
