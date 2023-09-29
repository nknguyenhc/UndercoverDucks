from sqlalchemy import create_engine, select
from db.base import Base
from dotenv import load_dotenv
import os
from os.path import join, dirname

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

if __name__ == '__main__':
    engine = create_engine(os.environ.get("DATABASE_URL"))
    Base.metadata.create_all(engine)
