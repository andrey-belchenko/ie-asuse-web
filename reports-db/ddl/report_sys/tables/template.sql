CREATE TABLE report_sys.template (
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  template_id text PRIMARY KEY,
  file_data BYTEA
);