from app.db.session import SessionLocal

from app.db.seeds.seed_roles import seed_roles
from app.db.seeds.seed_permissions import seed_permissions
from app.db.seeds.seed_role_permissions import seed_role_permissions
from app.db.seeds.seed_users import seed_users

def run():
    db = SessionLocal()
    try:
        seed_roles(db)              # safe even if roles exist
        seed_permissions(db)
        seed_role_permissions(db)
        seed_users(db)
        print("✅ Database seeding completed")
    finally:
        db.close()

if __name__ == "__main__":
    run()
