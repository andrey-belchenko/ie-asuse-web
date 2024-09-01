CREATE TABLE report_stg.фин_закрытие_начисл (
  id SERIAL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  док_нач_id int4,
  дата_закрытия date
);
CREATE INDEX фин_закрытие_начисл_док_нач_id ON report_stg.фин_закрытие_начисл USING btree(док_нач_id);
CREATE INDEX фин_закрытие_начисл_док_нач_id_дата_закрытия ON report_stg.фин_закрытие_начисл USING btree(док_нач_id, дата_закрытия);