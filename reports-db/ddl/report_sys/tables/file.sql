CREATE TABLE report_sys.file (
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  file_id text PRIMARY KEY,
  file_name TEXT,
  file_data BYTEA
);