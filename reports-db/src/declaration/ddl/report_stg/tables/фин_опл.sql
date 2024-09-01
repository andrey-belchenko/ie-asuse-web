CREATE TABLE report_stg.фин_опл (
	id SERIAL,
	changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	refresh_slice_id int4,
	договор_id int4 NULL,
	опл_id int4 NULL,
	вид_реал_id int4 NULL,
	тип_опл_id int4 NULL,
	исх_опл_id int4 NULL,
	док_нач_id int4 NULL,
	дата date NULL,
	период_id numeric(6, 2) NULL,
	опл numeric NULL
);

CREATE INDEX фин_опл_договор_id  ON report_stg.фин_опл USING btree(договор_id );
CREATE INDEX фин_опл_договор_id_дата  ON report_stg.фин_опл USING btree(договор_id, дата );