import os
import cx_Oracle

print (os.environ["PATH"])

# os.environ["PATH"] = r"C:\oracle\instantclient_19_24" + ";" + os.environ["PATH"]

# oracle_conn = cx_Oracle.connect("asuse", "kl0pik", "kaz-realkaz.infoenergo.loc:1521/realkazn")
# oracle_cur = oracle_conn.cursor()