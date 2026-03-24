import sqlite3
import os

db_path = "8lines.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    print("Tables:", cur.fetchall())
    cur.execute("PRAGMA table_info(onboardings);")
    print("Onboardings Schema:", cur.fetchall())
    cur.execute("SELECT * FROM onboardings LIMIT 1;")
    print("One row from Onboardings:", cur.fetchone())
    conn.close()
else:
    print("8lines.db not found")
