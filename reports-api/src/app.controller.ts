import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import {
  execQuery,
  putDataToTemp,
  replaceDateStrings,
} from './features/reports/services/mongo';
import {
  downloadFile,
  execFunction,
  queryTable,
} from './features/reports/services/pgsql';
import nav10 from './features/reports/config/navigators/nav10';
import { Navigator } from './features/reports/types/Navigator';
import {
  ConfigItem,
  configItemDict,
} from './features/reports/types/ConfigItem';
import { Response } from 'express';
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
    params = replaceDateStrings(params);
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

  @Get('file/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    let file = await downloadFile(id);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
    );
    res.type('application/octet-stream');
    res.send(file.fileData);
  }
}
