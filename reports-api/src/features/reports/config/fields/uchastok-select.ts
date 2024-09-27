import { query, queryTable } from '@/features/reports/services/pgsql';
import { SelectEditor } from '@/features/reports/types/editors/SelectEditor';
import { Field } from '@/features/reports/types/Field';

export default new Field({
  label: 'Участок',
  name: 'uchastok',
  editor: new SelectEditor({
    columns: ['имя'],
    keyField: 'участок_id',
    displayField: 'сокр_имя',
    listItems: async (params) => {
      if (!params.formValues.dep || params.formValues.dep.length == 0) {
        return await queryTable('report_dm.dim_участок');
      }
      return await query(
        /*sql*/ `select * from report_dm.dim_участок where отделение_id = ANY($1::int[])`,
        [params.formValues.dep],
      );
    },
    listItemsDeps: ['dep'],
  }),
});
