
import sys
import os

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from os.path import join, dirname
from db.traffic import Port, Traffic
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, select
from db.base import Base
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

if __name__ == '__main__':
    engine = create_engine(os.environ.get("DATABASE_URL"), echo=os.environ.get("DEBUG") == "True")

    with Session(engine) as session:
        tuaslink = Port(
            name="Tuas Link",
            volume=1000,
        )
        pasirpanjang = Port(
            name="Pasir Panjang",
            volume=2000,
        )
        session.add_all([tuaslink, pasirpanjang])
        session.commit()
