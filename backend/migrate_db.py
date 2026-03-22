import sqlite3

def migrate():
    conn = sqlite3.connect('8lines.db')
    cursor = conn.cursor()
    
    # ── Onboardings ──
    try:
        cursor.execute("ALTER TABLE onboardings ADD COLUMN agreement_url VARCHAR(500);")
        print("Added agreement_url to onboardings")
    except sqlite3.OperationalError:
        print("agreement_url already exists in onboardings")
        
    try:
        cursor.execute("ALTER TABLE onboardings ADD COLUMN pan_s3_key VARCHAR(500);")
        print("Added pan_s3_key to onboardings")
    except sqlite3.OperationalError:
        print("pan_s3_key already exists in onboardings")
        
    try:
        cursor.execute("ALTER TABLE onboardings ADD COLUMN aadhaar_s3_key VARCHAR(500);")
        print("Added aadhaar_s3_key to onboardings")
    except sqlite3.OperationalError:
        print("aadhaar_s3_key already exists in onboardings")
        
    # ── Vehicles ──
    try:
        cursor.execute("ALTER TABLE vehicles ADD COLUMN agreement_url VARCHAR(500);")
        print("Added agreement_url to vehicles")
    except sqlite3.OperationalError:
        print("agreement_url already exists in vehicles")
        
    conn.commit()
    conn.close()
    print("Migration complete!")

if __name__ == "__main__":
    migrate()
