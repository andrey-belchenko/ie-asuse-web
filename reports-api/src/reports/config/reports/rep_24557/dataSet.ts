import { execFunction } from '@/pgsql';

export default async (formValues: any) => {
  return await execFunction('report_util.get_rep_24557', {
    p_дата: formValues.date,
    p_отделение_id: formValues.dep,
    p_участок_id: formValues.uchastok,
  });
};
