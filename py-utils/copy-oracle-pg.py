import cx_Oracle
import psycopg2
import psycopg2.extras

def connect_oracle():
    cx_Oracle.init_oracle_client(lib_dir=r"C:\INFOENERGO\x64")
    global oracle_conn
    global oracle_cur
    oracle_conn = cx_Oracle.connect(
        "asuse", "kl0pik", "kaz-realkaz.infoenergo.loc:1521/realkazn"
    )
    oracle_cur = oracle_conn.cursor()


def close_oracle():
    oracle_cur.close()
    oracle_conn.close()


def connect_pg():
    global pg_conn
    global pg_cur
    pg_conn = psycopg2.connect(
        "dbname='asuse' user='asuse' host='asuse-ai-dev.infoenergo.loc' port='5432' password='kl0pik'"
    )
    pg_cur = pg_conn.cursor()


def close_pg():
    pg_conn.close()
    pg_cur.close()


def connect():
    connect_oracle()
    connect_pg()


def close():
    close_oracle()
    close_pg()


def copy_table_declaration(table_name, target_schema):
    oracle_cur.execute(
        f"SELECT column_name, data_type FROM ALL_TAB_COLUMNS WHERE table_name = UPPER('{table_name}')"
    )
    columns = oracle_cur.fetchall()
    type_mapping = {
        "NUMBER": "NUMERIC",
        "VARCHAR2": "VARCHAR",
        "DATE": "TIMESTAMP",
        "CHAR": "CHAR",
        "CLOB": "TEXT",
        "BLOB": "BYTEA",
        "RAW": "BYTEA",
        "LONG": "BIGINT",
        "FLOAT": "REAL",
        "BINARY_FLOAT": "REAL",
        "BINARY_DOUBLE": "DOUBLE PRECISION",
        "TIMESTAMP": "TIMESTAMP",
        "TIMESTAMP WITH TIME ZONE": "TIMESTAMPTZ",
        "TIMESTAMP WITH LOCAL TIME ZONE": "TIMESTAMPTZ",
        "INTERVAL YEAR TO MONTH": "INTERVAL",
        "INTERVAL DAY TO SECOND": "INTERVAL",
    }
    query = f"CREATE TABLE IF NOT EXISTS {target_schema}.{table_name} ("
    for column in columns:
        pg_data_type = type_mapping.get(column[1])
        query += "{} {},".format(column[0], pg_data_type)
    query = query.rstrip(",") + ")"
    print("Executing: ", "\n", query)
    pg_cur.execute(query)
    pg_conn.commit()


def copy_table_data(table_name, target_schema):
    print(f"{table_name} clearing")
    pg_cur.execute(f"delete from {target_schema}.{table_name}")
    oracle_cur.arraysize = 5000
    oracle_cur.execute(f"SELECT * FROM {table_name}")
    count = 0
    print(f"{table_name} copying data started")
    while True:
        rows = oracle_cur.fetchmany()
        if not rows:
            break
        count += len(rows)
        insert_query = f"INSERT INTO {target_schema}.{table_name} VALUES %s"
        psycopg2.extras.execute_values(
            pg_cur, insert_query, rows
        ) 
        pg_conn.commit()
        print(count)
    print(f"{table_name} copying data finished")


connect()
copy_table_declaration("rs_refcode", "report_src")
copy_table_declaration("rr_refprop", "report_src")
copy_table_data("rs_refcode", "report_src")
copy_table_data("rr_refprop", "report_src")

close()