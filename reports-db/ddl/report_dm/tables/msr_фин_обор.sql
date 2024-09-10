CREATE TABLE report_dm.msr_фин_обор (
	id SERIAL,
	changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	refresh_slice_id int4,
	effect_date date,
	договор_id int4,
	док_нач_id int4 NULL,
	вид_реал_id int4 NULL,
	дата date,
	обор_деб numeric NULL,
	обор_кред numeric NULL,
	обор_деб_просроч numeric NULL
);
-- CREATE INDEX  ON report_dm.msr_фин_обор USING btree(договор_id);
-- CREATE INDEX  ON report_dm.msr_фин_обор USING btree(дата);
-- CREATE INDEX  ON report_dm.msr_фин_обор USING btree(effect_date);
-- CREATE INDEX  ON report_dm.msr_фин_обор USING btree(договор_id, дата);
-- CREATE INDEX  ON report_dm.msr_фин_обор USING btree(договор_id, effect_date);