from flask import Blueprint, request
from json import dumps
from sqlalchemy import select
from sqlalchemy.orm import Session
from db.traffic import Port, Traffic
from migrations import engine

traffic = Blueprint('traffic', __name__)

@traffic.route('/volume')
def volume():
    port_id = request.args.get('port_id')
    
    try:
        port_id = int(port_id)
    except (ValueError, TypeError):
        return dumps({
            "message": "invalid port_id provided"
        })

    with Session(engine) as session:
        stmt = select(Port).where(Port.id == port_id)
        port = session.scalars(stmt).one()

        return dumps({
            "id": port.id,
            "name": port.name,
        })
