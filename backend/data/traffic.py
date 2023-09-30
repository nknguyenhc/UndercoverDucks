
import sys
import os

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from os.path import join, dirname
from db.traffic import Port, Traffic, Similarity
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
            id=1,
            name="Tuas Link",
            traffics_from=[],
            traffics_to=[],
            volume=1000,
        )
        pasirpanjang = Port(
            id=2,
            name="Pasir Panjang",
            traffics_from=[],
            traffics_to=[],
            volume=2000,
        )
        tuaslink_pasirpanjang = Traffic(
            port_from_id=1,
            port_to_id=2,
            proportion=0.5,
        )
        tuaslink_tuaslink = Traffic(
            port_from_id=1,
            port_to_id=1,
            proportion=0.5,
        )
        pasirpanjang_tuaslink = Traffic(
            port_from_id=2,
            port_to_id=1,
            proportion=0.7,
        )
        pasirpanjang_pasirpanjang = Traffic(
            port_from_id=2,
            port_to_id=2,
            proportion=0.3,
        )
        similarity_tuaslink_pasirpanjang = Similarity(
            port1_id=1,
            port2_id=2,
            value=0.5,
        )
        session.add_all([
            tuaslink, 
            pasirpanjang, 
            tuaslink_pasirpanjang, 
            tuaslink_tuaslink,
            pasirpanjang_tuaslink,
            pasirpanjang_pasirpanjang,
            similarity_tuaslink_pasirpanjang,
        ])
        session.commit()
