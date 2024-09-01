CREATE TABLE report_dm.msr_фин (
    id SERIAL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refresh_slice_id int4,
    договор_id int4,
    вид_реал_id int4 NULL,
    дата date,
    док_нач_id int4 NULL,
    опл_id int4 NULL,
    акт_с date,
    акт_по date,
    начисл numeric NULL,
    погаш_оплатой_без_аванса numeric NULL,
    погаш_оплатой_аванс numeric NULL,
    погаш_из_перепл numeric NULL,
    погаш_из_аванса numeric NULL,
    погаш_оплатой numeric NULL,
    погаш_из_кред numeric NULL,
    погаш numeric NULL,
    погаш_без_аванса numeric NULL,
    опл_кред_перепл numeric NULL,
    опл_кред_аванс numeric NULL,
    сторно_кред_перепл numeric NULL,
    обор_кред numeric NULL,
    опл_кред numeric NULL,
    сторно_кред numeric NULL,
    долг numeric NULL,
    долг_кред numeric NULL,
    долг_деб numeric NULL
);
CREATE INDEX i_msr_фин_договор_id ON report_dm.msr_фин USING btree(договор_id);
CREATE INDEX i_msr_фин_акт_с ON report_dm.msr_фин USING btree(акт_с);
CREATE INDEX i_msr_фин_акт_по ON report_dm.msr_фин USING btree(акт_по);
CREATE INDEX i_msr_фин_акт ON report_dm.msr_фин USING btree(акт_с, акт_по);