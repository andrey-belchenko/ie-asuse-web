
import CustomStore from 'devextreme/data/custom_store';
import type { SelectEditor as SelectEditorConfig } from '@/reports/types/editors/SelectEditor';

export function makeDataSource(config: SelectEditorConfig, formValues:any) {
    return new CustomStore({
        loadMode: 'raw',
        key: config.keyField,
        load(options) {
            if (config.listItems) {
                return config.listItems({ formValues: formValues })
            } else {
                return []
            }
            // return config.data ?? queryTable({ tableName: config.tableName! })
        },
    });
}

