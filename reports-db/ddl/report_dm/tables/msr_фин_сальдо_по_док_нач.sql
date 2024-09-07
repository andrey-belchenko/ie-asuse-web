CREATE TABLE report_dm.msr_фин_сальдо_по_док_нач (
    id SERIAL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refresh_slice_id int4,
    договор_id int4,
    док_нач_id int4,
    вид_реал_id int4,
    акт_с date,
    акт_по date,
    долг_деб numeric NULL,
    долг_деб_просроч numeric NULL
);
CREATE INDEX  ON report_dm.msr_фин_сальдо_по_док_нач USING btree(договор_id);
CREATE INDEX  ON report_dm.msr_фин_сальдо_по_док_нач USING btree(док_нач_id);
CREATE INDEX  ON report_dm.msr_фин_сальдо_по_док_нач USING btree(договор_id,акт_с,акт_по);
CREATE INDEX  ON report_dm.msr_фин_сальдо_по_док_нач USING btree(акт_с,акт_по);