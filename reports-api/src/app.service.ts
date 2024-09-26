import { Injectable } from '@nestjs/common';
import { Executor } from './features/reports/types/Executor';
import { ServerExecutor } from './features/reports/services/ServerExecutor';

@Injectable()
export class AppService {
  constructor() {
     Executor.setInstance(new ServerExecutor())
  } 
  getHello(): string {
    
    console.log('yep');
    return 'Hello World!!!';
  }
}
