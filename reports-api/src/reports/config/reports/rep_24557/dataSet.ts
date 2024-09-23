import { execFunction } from '@/pgsql';
import { DataSource } from '@/reports/types/DataSource';

// export default new DataSource({
//   functionName: 'report_util.get_rep_24557',
//   paramsBinding: {
//     p_дата: 'date',
//     p_отделение_id: 'dep',
//     p_участок_id: 'uchastok',
//   },
// });

export default async (formValues: any) => {
  return await execFunction('report_util.get_rep_24557', {
    p_дата: formValues.date,
    p_отделение_id: formValues.dep,
    p_участок_id: formValues.uchastok,
  });
};
