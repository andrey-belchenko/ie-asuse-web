import { query, queryTable } from '@/pgsql';
import { SelectEditor } from '@/reports/types/editors/SelectEditor';
import { Field } from '@/reports/types/Field';

export default new Field({
  label: 'Участок',
  name: 'uchastok',
  editor: new SelectEditor({
    columns: ['имя'],
    keyField: 'участок_id',
    displayField: 'сокр_имя',
    listItems: async (params) => {
      if (!params.formValues.dep) {
        return [];
      }
      return await query(
        /*sql*/ `select * from report_dm.dim_участок where отделение_id = ANY($1::int[])`,
        [params.formValues.dep],
      );
    },
    listItemsDeps: ['dep'],
  }),
});
