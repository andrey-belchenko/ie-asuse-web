import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { execQuery, putDataToTemp } from './mongo';
import { execFunction, queryTable } from './pgsql';
import nav10 from './reports/config/navigators/nav10';
import { Navigator } from './reports/types/Navigator';
import { Field } from './reports/types/Field';
import { DateEditor } from './reports/types/editors/DateEditor';
import { Editor } from './reports/types/Editor';
import { instantiate } from './reports/types';
import { Folder } from './reports/types/Folder';
import { RegularReport } from './reports/types/reports/RegularReport';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('query')
  async create(@Body() request: any): Promise<any> {
    const data = await execQuery(request);
    return data;
  }

  @Post('call')
  async call(@Body() request: any): Promise<void> {
    const data = await execFunction(request.functionName, request.params);
    await putDataToTemp(data, request.tempTableName);
    // return data;
  }

  @Post('query-table')
  async queryPgTable(@Body() request: any): Promise<any> {
    const data = await queryTable(request.tableName);
    return { data: data };
  }

  @Get('test')
  async test(): Promise<any> {
    return { result: 'Ок' };
  }

  @Get('reports-config')
  async reportsConfig(): Promise<Navigator> {
    return nav10;
  }

  // @Get('reports-config')
  // async reportsConfig(): Promise<any> {
  //   // const cls = DateEditor;
  //   // return new cls({});
  //   let item = new DateEditor({})
  //   // return new registry[item.className](item.toJSON())
  //   return instantiate(item.toJSON())
  // }

  // @Get('reports-config')
  // async reportsConfig(): Promise<any> {
  //   let  item = new Field({
  //     label: 'Дата',
  //     name: 'date',
  //     editor: new DateEditor({}),
  //     defaultValue: () => new Date(2022, 2, 31),
  //   })

  //   const text = JSON.stringify(item);
  //   item = JSON.parse(text)
  //   return instantiate(item)
  // }

  // @Get('reports-config')
  // async reportsConfig(): Promise<any> {
  //   let item = nav10;

  //   const text = JSON.stringify(item);
  //   item = JSON.parse(text);

  //   // return item;
  //   item =  instantiate(item);
  //   // return instantiate(item);
  //   return {value: ((item.items[0] as Folder).items[0] as RegularReport).paramsForm.fields[0].defaultValue()}
  // }
}
