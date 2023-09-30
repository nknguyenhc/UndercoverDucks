
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

dotenv_path = join(dirname(__file__), '../.env')
load_dotenv(dotenv_path)

if __name__ == '__main__':
    engine = create_engine(os.environ.get("DATABASE_URL"), echo=os.environ.get("DEBUG") == "True")

    with Session(engine) as session:
        tuaslink = Port(
            name="Tuas Link",
            traffics_from=[],
            traffics_to=[],
            volume=1000,
        )
        pasirpanjang = Port(
            name="Pasir Panjang",
            traffics_from=[],
            traffics_to=[],
            volume=2000,
        )
        tuaslink_pasirpanjang = Traffic(
            port_from_id=tuaslink.id,
            port_to_id=pasirpanjang.id,
            proportion=0.5,
        )
        pasirpanjang_tuaslink = Traffic(
            port_from_id=pasirpanjang.id,
            port_to_id=tuaslink.id,
            proportion=0.7,
        )
        tuaslink.traffics_from.append(tuaslink_pasirpanjang)
        tuaslink.traffics_to.append(pasirpanjang_tuaslink)
        pasirpanjang.traffics_from.append(pasirpanjang_tuaslink)
        pasirpanjang.traffics_to.append(tuaslink_pasirpanjang)
        session.add_all([
            tuaslink, 
            pasirpanjang, 
            tuaslink_pasirpanjang, 
            pasirpanjang_tuaslink,
        ])
        session.commit()
