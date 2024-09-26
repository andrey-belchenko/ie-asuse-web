import { queryTable } from '@/pgsql';
import { SelectEditor } from '@/reports/types/editors/SelectEditor';
import { Field } from '@/reports/types/Field';

export default new Field({
  label: 'Отделение',
  name: 'dep',
  editor: new SelectEditor({
    columns: ['аббр', 'имя'],
    keyField: 'отделение_id',
    displayField: 'аббр',
    listItems: async () => {
      return await queryTable('report_dm.dim_отделение');
    },
  }),
});
