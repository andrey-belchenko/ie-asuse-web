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
    долг_деб numeric NULL,
    долг_деб_просроч numeric NULL
);
CREATE INDEX  ON report_dm.msr_фин_сальдо_по_дог_вид_реал USING btree(договор_id);
CREATE INDEX  ON report_dm.msr_фин_сальдо_по_дог_вид_реал USING btree(договор_id,акт_с,акт_по);
CREATE INDEX  ON report_dm.msr_фин_сальдо_по_дог_вид_реал USING btree(акт_с,акт_по);