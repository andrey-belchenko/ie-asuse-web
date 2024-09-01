CREATE TABLE report_dm.dim_дата (
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    дата date NULL PRIMARY KEY,
    год int4 NULL,
    месяц int4 NULL
);
CREATE INDEX i_dim_дата_год ON report_dm.dim_дата USING btree(год);
CREATE INDEX i_dim_дата_месяц ON report_dm.dim_дата USING btree(месяц);