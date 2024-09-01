CREATE TABLE report_dm.msr_фин_опл_погаш (
	id SERIAL,
	changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	refresh_slice_id int4,
	опл_id int4 NULL,
	договор_id int4,
	вид_реал_id int4 NULL,
	дата date,
	док_нач_id int4 NULL,
	погаш_оплатой_без_аванса numeric NULL,
	погаш_оплатой_аванс numeric NULL,
	погаш_из_перепл numeric NULL,
	погаш_из_аванса numeric NULL,
	погаш_оплатой numeric NULL,
	погаш_из_кред numeric NULL,
	погаш numeric NULL,
	погаш_без_аванса numeric NULL
);

CREATE INDEX i_msr_фин_опл_погаш_договор_id ON report_dm.msr_фин_опл_погаш USING btree(договор_id);
CREATE INDEX i_msr_фин_опл_погаш_дата ON report_dm.msr_фин_опл_погаш USING btree(дата);
CREATE INDEX i_msr_фин_опл_погаш_договор_id_дата ON report_dm.msr_фин_опл_погаш USING btree(договор_id, дата);