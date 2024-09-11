CREATE TABLE report_dm.dim_дата (
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    дата date NULL PRIMARY KEY,
    год int4,
    месяц int4,
    месяц_имя text
);
CREATE INDEX i_dim_дата_год ON report_dm.dim_дата USING btree(год);
CREATE INDEX i_dim_дата_месяц ON report_dm.dim_дата USING btree(месяц);