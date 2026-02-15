import os

PROJECT_NAME = "backend"

DIRS = [
    "app/core",
    "app/api/v1/endpoints",
    "app/models",
    "app/schemas",
    "app/crud",
    "app/db",
    "app/services",
    "app/utils",
    "app/tests",
    "alembic/versions",
]

FILES = [
    ".env",
    ".env.example",
    "README.md",
    "requirements.txt",
    "pyproject.toml",
    "Dockerfile",
    "docker-compose.yml",
    "gunicorn_conf.py",
    "alembic.ini",
    "start.sh",

    "app/main.py",

    "app/core/__init__.py",
    "app/core/config.py",
    "app/core/security.py",
    "app/core/logging.py",
    "app/core/exceptions.py",

    "app/api/__init__.py",
    "app/api/deps.py",
    "app/api/v1/__init__.py",
    "app/api/v1/router.py",

    "app/api/v1/endpoints/__init__.py",
    "app/api/v1/endpoints/auth.py",
    "app/api/v1/endpoints/users.py",
    "app/api/v1/endpoints/items.py",
    "app/api/v1/endpoints/health.py",

    "app/models/__init__.py",
    "app/models/base.py",
    "app/models/user.py",
    "app/models/item.py",

    "app/schemas/__init__.py",
    "app/schemas/user.py",
    "app/schemas/item.py",
    "app/schemas/auth.py",

    "app/crud/__init__.py",
    "app/crud/base.py",
    "app/crud/crud_user.py",
    "app/crud/crud_item.py",

    "app/db/__init__.py",
    "app/db/base.py",
    "app/db/session.py",
    "app/db/init_db.py",

    "app/services/__init__.py",
    "app/services/auth_service.py",
    "app/services/user_service.py",

    "app/utils/__init__.py",
    "app/utils/email.py",
    "app/utils/pagination.py",
    "app/utils/validators.py",

    "app/tests/__init__.py",
    "app/tests/conftest.py",
    "app/tests/test_auth.py",
    "app/tests/test_users.py",

    "alembic/env.py",
    "alembic/script.py.mako",
]


def create_structure():
    print("🚀 Creating FastAPI production structure...\n")

    project_path = os.path.abspath(PROJECT_NAME)

    for directory in DIRS:
        dir_path = os.path.join(project_path, directory)
        os.makedirs(dir_path, exist_ok=True)
        print(f"📁 Created directory: {dir_path}")

    for file in FILES:
        file_path = os.path.join(project_path, file)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        if not os.path.exists(file_path):
            with open(file_path, "w", encoding="utf-8") as f:
                pass
            print(f"📄 Created file: {file_path}")
        else:
            print(f"⚠️  File already exists: {file_path}")

    print("\n✅ FastAPI production structure created successfully!")


if __name__ == "__main__":
    create_structure()
