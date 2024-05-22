import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EventListtersService {
  @OnEvent('user created')
  async sendEmailEvent(user: any) {
    console.log('User created Event triggered', user.email);
  }
}
