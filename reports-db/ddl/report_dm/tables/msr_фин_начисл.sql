CREATE TABLE report_dm.msr_фин_начисл (
	id SERIAL,
	changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	refresh_slice_id int4,
	договор_id int4,
	вид_реал_id int4 NULL,
	дата date,
	док_нач_id int4 NULL,
	вид_тов_id int4 NULL,
	начисл numeric NULL
);
CREATE INDEX i_msr_фин_начисл_договор_id ON report_dm.msr_фин_начисл USING btree(договор_id);
CREATE INDEX i_msr_фин_начисл_дата ON report_dm.msr_фин_начисл USING btree(дата);
CREATE INDEX i_msr_фин_начисл_договор_id_дата ON report_dm.msr_фин_начисл USING btree(договор_id, дата);