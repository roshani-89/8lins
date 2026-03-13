"""
Run this script to make any user an admin.
Usage: python make_admin.py 9876543210
"""
import sys
from app.core.database import SessionLocal
from app.models.user import User

def make_admin(phone: str):
    phone = "".join(filter(str.isdigit, phone))[-10:]
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.phone == phone).first()
        if not user:
            print(f"User with phone {phone} not found.")
            print("Login once first at http://localhost:3000/login to create the user.")
            return
        user.role = 'admin'
        db.commit()
        print(f"✓ {phone} is now an ADMIN.")
        print(f"  Login at: http://localhost:3000/login")
        print(f"  Then go to: http://localhost:3000/admin")
    finally:
        db.close()

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python make_admin.py <phone_number>")
        print("Example: python make_admin.py 9876543210")
    else:
        make_admin(sys.argv[1])
