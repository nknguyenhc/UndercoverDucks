import sys
import os
from os.path import join, dirname
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from db.users import UserAuth
from migrations import engine


dotenv_path = join(dirname(__file__), '../.env')
load_dotenv(dotenv_path)

if __name__ == '__main__':
    with Session(engine) as session:
        test_user = UserAuth(
            username="test",
            password_hash=generate_password_hash("test"),
        )
        session.add_all([test_user])
        session.commit()
    
