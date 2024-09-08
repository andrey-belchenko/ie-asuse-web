import cx_Oracle
import psycopg2

# Oracle connection
oracle_conn = cx_Oracle.connect(
    "asuse", "kl0pik", "kaz-realkaz.infoenergo.loc:1521/realkazn"
)
oracle_cur = oracle_conn.cursor()

# # PostgreSQL connection
# pg_conn = psycopg2.connect("dbname='pg_dbname' user='pg_username' host='pg_host' password='pg_password'")
# pg_cur = pg_conn.cursor()

# # Fetch data from Oracle table
# oracle_cur.arraysize = 5000  # Fetch 5000 rows at a time
# oracle_cur.execute("SELECT * FROM oracle_table")

# while True:
#     rows = oracle_cur.fetchmany()
#     if not rows:
#         break

#     # Insert data into PostgreSQL table
#     for row in rows:
#         insert_query = "INSERT INTO pg_table VALUES {}".format(row)
#         pg_cur.execute(insert_query)

#     # Commit changes
#     pg_conn.commit()

# # Close connections
# oracle_cur.close()
# oracle_conn.close()
# pg_cur.close()
# pg_conn.close()


# REALKAZN.WORLD =
#  (DESCRIPTION =
#    (ADDRESS = (PROTOCOL = TCP)(HOST = kaz-realkaz.infoenergo.loc)(PORT = 1521))
#    (CONNECT_DATA =
#      (SID = realkazn)
#      (server = dedicated)
#    )
#  )




# # Fetch data from Oracle table
# oracle_cur.execute("SELECT * FROM oracle_table")
# rows = oracle_cur.fetchall()



# # Fetch column names and types from Oracle table
oracle_cur.execute("SELECT column_name, data_type FROM USER_TAB_COLUMNS WHERE table_name = 'oracle_table'")
columns = oracle_cur.fetchall()

print(columns)

# # Create table in PostgreSQL
# create_table_query = "CREATE TABLE IF NOT EXISTS pg_table ("
# for column in columns:
#     create_table_query += "{} {},".format(column[0], column[1])
# create_table_query = create_table_query.rstrip(',') + ")"
# pg_cur.execute(create_table_query)

# # Insert data into PostgreSQL table
# for row in rows:
#     insert_query = "INSERT INTO pg_table VALUES {}".format(row)
#     pg_cur.execute(insert_query)

# # Commit changes and close connections
# pg_conn.commit()
# oracle_cur.close()
# oracle_conn.close()
# pg_cur.close()
# pg_conn.close()
