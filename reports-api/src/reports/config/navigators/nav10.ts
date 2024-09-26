import { GeneratorReport } from '@/reports/types/reports/GeneratorReport';
import { Folder } from '../../types/Folder';
import { Navigator } from '../../types/Navigator';
import { RegularReport } from '../../types/reports/RegularReport';
import { repBezuchet } from '../reports';
import oborVed from '../reports/obor-ved';
import rep_25316 from '../reports/rep-25316';
import rep_25316_dog from '../reports/rep-25316-dog';
import oborVedFr from '../reports/obor-ved-fr';
import { getGeneratorReports } from '../reports/external-reports';
import rep_24557 from '../reports/rep-24557';

export default new Navigator({
  name: 'nav10',
  items: [
    new Folder({
      title: 'Отчеты по задолженности',
      items: [
        new Folder({
          title: 'Просроченная задолженность',
          items: [...rep_24557],
        }),
      ],
    }),
    new Folder({
      title: 'Отчеты по безучетному потреблению',
      items: repBezuchet,
    }),
    new Folder({
      title: 'Оборотная ведомость',
      items: [
        oborVed,
        oborVedFr,
        new RegularReport({
          title: 'Оборотная ведомость по полученным задаткам',
        }),
      ],
    }),
    new Folder({
      title: 'Отчеты по оплатам',
      items: [rep_25316, rep_25316_dog],
    }),
    new Folder({
      title: 'Отчеты генератора отчетов',
      items: getGeneratorReports(),
    }),
  ],
});
