import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { execQuery, putDataToTemp, replaceDateStrings } from './mongo';
import { execFunction, queryTable } from './pgsql';
import nav10 from './reports/config/navigators/nav10';
import { Navigator } from './reports/types/Navigator';
import { ConfigItem, configItemDict } from './reports/types/ConfigItem';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    // setPrepareTemplateFunc(async (templatePath, templateId) => {
    //   await convertAndSaveFrTemplate(templatePath, templateId);
    // });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('query')
  async create(@Body() request: any): Promise<any> {
    const data = await execQuery(request);
    return data;
  }

  @Post('config-items/:configItemId/methods/:methodName/call')
  async executeMethod(
    @Param('configItemId') configItemId: string,
    @Param('methodName') methodName: string,
    @Body() params: any,
  ): Promise<any> {
    params =  replaceDateStrings(params);
    const result = await configItemDict[configItemId][methodName](params);
    if (result instanceof ConfigItem) {
      result.setIds(`${configItemId}.${methodName}`);
    }
    // console.log(JSON.stringify({ data: result }));
    return { data: result };
  }

  // @Get('test')
  // async test(): Promise<any> {
  //   return new SelectEditor({
  //     columns: ['аббр', 'имя'],
  //     keyField: 'отделение_id',
  //     displayField: 'аббр',
  //     listItems: async () => {
  //       return await queryTable('report_dm.dim_отделение');
  //     },
  //   });
  // }

  @Get('reports-config')
  async reportsConfig(): Promise<Navigator> {
    nav10.setIds(nav10.name);
    return nav10;
  }

  
}
