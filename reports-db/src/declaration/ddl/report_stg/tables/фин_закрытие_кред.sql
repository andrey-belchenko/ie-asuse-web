CREATE TABLE report_stg.фин_закрытие_кред (
  id SERIAL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  опл_id int4,
  дата_закрытия date
);
CREATE INDEX фин_закрытие_кред_опл_id ON report_stg.фин_закрытие_кред USING btree(опл_id);
CREATE INDEX фин_закрытие_кред_опл_id_дата_закрытия ON report_stg.фин_закрытие_кред USING btree(опл_id, дата_закрытия);