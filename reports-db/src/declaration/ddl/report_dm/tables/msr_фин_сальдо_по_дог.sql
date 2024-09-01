CREATE TABLE report_dm.msr_фин_сальдо_по_дог (
    id SERIAL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refresh_slice_id int4,
    договор_id int4,
    акт_с date,
    акт_по date,
    долг_осн_деб numeric NULL,
    долг_осн_кред numeric NULL,
    долг_осн numeric NULL,
    долг numeric NULL,
    долг_деб numeric NULL
);
CREATE INDEX i_msr_фин_сальдо_по_дог_договор_id ON report_dm.msr_фин_сальдо_по_дог USING btree(договор_id);
CREATE INDEX i_msr_фин_сальдо_по_дог_акт_с ON report_dm.msr_фин_сальдо_по_дог USING btree(акт_с);
CREATE INDEX i_msr_фин_сальдо_по_дог_акт_по ON report_dm.msr_фин_сальдо_по_дог USING btree(акт_по);