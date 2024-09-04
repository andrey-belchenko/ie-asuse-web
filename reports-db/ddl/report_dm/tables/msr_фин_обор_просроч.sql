CREATE TABLE report_dm.msr_фин_обор_просроч (
    id SERIAL,
	changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	refresh_slice_id int4,
	effect_date date,
	дата date,
	договор_id int4 NULL,
	вид_реал_id int4 NULL,
	док_нач_id int4 NULL,
	начисл numeric NULL,
	отмена_начисл numeric NULL,
    опл numeric NULL,
    отмена_опл numeric NULL,
    обор numeric NULL
);