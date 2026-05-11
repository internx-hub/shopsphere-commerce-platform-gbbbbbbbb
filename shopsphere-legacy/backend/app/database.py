from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# FIXME: hardcoded database URL - should use env var
# See review feedback: "Hardcoded database URL on line 6"
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/shopsphere"

engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()