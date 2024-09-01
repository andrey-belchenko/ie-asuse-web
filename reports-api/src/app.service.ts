import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('yep');
    return 'Hello World!!!';
  }
}
