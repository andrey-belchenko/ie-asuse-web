CREATE TABLE report_stg.refresh_slice (
  refresh_slice_id SERIAL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  договор_id int4,
  дата_c date,
  дата_по date,
  дата_архивации date,
  период_с numeric(6, 2) NULL,
  период_по numeric(6, 2) NULL
);

CREATE UNIQUE INDEX idx_refresh_slice_договор_id ON report_stg.refresh_slice USING btree(договор_id);
CREATE INDEX refresh_slice_idx_договор_id_дата ON report_stg.refresh_slice USING btree(договор_id, дата_c, дата_по);
CREATE INDEX refresh_slice_idx_договор_id_период ON report_stg.refresh_slice USING btree(договор_id, период_с, период_по);

CREATE OR REPLACE FUNCTION report_stg.refresh_slice_tr_func() RETURNS TRIGGER AS $$
BEGIN
  NEW.период_с := report_stg.get_ym_from_date(NEW.дата_c);
  NEW.период_по := report_stg.get_ym_from_date(NEW.дата_по);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER refresh_slice_tr
BEFORE INSERT OR UPDATE ON report_stg.refresh_slice
FOR EACH ROW
EXECUTE FUNCTION report_stg.refresh_slice_tr_func();



