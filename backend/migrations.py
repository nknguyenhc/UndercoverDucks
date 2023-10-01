from sqlalchemy import create_engine, select
from db.base import Base
from db.traffic import Port, Traffic, Similarity
from db.users import UserAuth
from dotenv import load_dotenv
import os
from os.path import join, dirname

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

engine = create_engine(os.environ.get("DATABASE_URL"), echo=os.environ.get("DEBUG") == "True")

if __name__ == '__main__':
    UserAuth.__table__.drop(engine)
    Similarity.__table__.drop(engine)
    Traffic.__table__.drop(engine)
    Port.__table__.drop(engine)
    Port.metadata.create_all(engine)
    Traffic.metadata.create_all(engine)
    Similarity.metadata.create_all(engine)
    UserAuth.metadata.create_all(engine)
