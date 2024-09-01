CREATE TABLE report_dm.msr_фин_сальдо_по_дог_вид_реал (
    id SERIAL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refresh_slice_id int4,
    договор_id int4,
    вид_реал_id int4 NULL,
    акт_с date,
    акт_по date,
    долг numeric NULL,
    долг_кред numeric NULL,
    долг_деб numeric NULL
);
CREATE INDEX i_msr_фин_сальдо_по_дог_вид_реал_договор_id ON report_dm.msr_фин_сальдо_по_дог_вид_реал USING btree(договор_id);
CREATE INDEX i_msr_фин_сальдо_по_дог_вид_реал_акт_с ON report_dm.msr_фин_сальдо_по_дог_вид_реал USING btree(акт_с);
CREATE INDEX i_msr_фин_сальдо_по_дог_вид_реал_акт_по ON report_dm.msr_фин_сальдо_по_дог_вид_реал USING btree(акт_по);