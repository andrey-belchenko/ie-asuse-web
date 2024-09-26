
export type DataSet =  SingleTableDataSet | MultiTableDataSet 
type SingleTableDataSet = any[];
type MultiTableDataSet = {
  [key: string]: SingleTableDataSet;
};
