CREATE TABLE report_dm.msr_фин_опл_кредит (
	id SERIAL,
	changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	refresh_slice_id int4,
	опл_id int4 NULL,
	договор_id int4,
	вид_реал_id int4 NULL,
	дата date,
	опл_кред_перепл numeric NULL,
	опл_кред_аванс numeric NULL,
	сторно_кред_перепл numeric NULL,
	обор_кред numeric NULL,
	опл_кред numeric NULL,
	сторно_кред numeric NULL
);

CREATE INDEX i_msr_фин_опл_кредит_договор_id ON report_dm.msr_фин_опл_кредит USING btree(договор_id);
CREATE INDEX i_msr_фин_опл_кредит_дата ON report_dm.msr_фин_опл_кредит USING btree(дата);
CREATE INDEX i_msr_фин_опл_кредит_договор_id_дата ON report_dm.msr_фин_опл_кредит USING btree(договор_id, дата);