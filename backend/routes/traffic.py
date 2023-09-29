from flask import Blueprint, request
from json import dumps
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from sqlalchemy.orm import Session
from db.traffic import Port, Traffic
from migrations import engine

traffic = Blueprint('traffic', __name__)

def get_port(port_id):
    with Session(engine) as session:
        stmt = select(Port).where(Port.id == port_id)
        port = session.scalars(stmt).one()
        return {
            "id": port.id,
            "name": port.name,
            "volume": port.volume,
        }

@traffic.route('/volume', methods=['GET'])
def volume():
    port_id = request.args.get('port_id')
    
    try:
        port_id = int(port_id)
    except (ValueError, TypeError):
        return dumps({
            "message": "invalid port_id provided",
        }), 400
    
    try:
        return dumps({
            "message": "success",
            "port": get_port(port_id)
        })
    except NoResultFound:
        return dumps({
            "message": "invalid port_id provided",
        }), 400

@traffic.route('/between', methods=['GET'])
def between():
    port_from_id = request.args.get('port_from_id')
    port_to_id = request.args.get('port_to_id')

    try:
        port_from_id = int(port_from_id)
    except (ValueError, TypeError):
        return dumps({
            "message": "invalid port_from_id provided",
        }), 400
    
    try:
        port_to_id = int(port_to_id)
    except (ValueError, TypeError):
        return dumps({
            "message": "invalid port_to_id provided",
        }), 400
    
    try:
        port_from = get_port(port_from_id)
    except NoResultFound:
        return dumps({
            "message": "invalid port_from_id provided",
        }), 400
    
    try:
        port_to = get_port(port_to_id)
    except NoResultFound:
        return dumps({
            "message": "invalid port_to_id provided",
        }), 400
    
    with Session(engine) as session:
        stmt = select(Traffic) \
            .where(Traffic.port_from_id == port_from_id) \
            .where(Traffic.port_to_id == port_to_id)
        
        try:
            traffic_info = session.scalars(stmt).one()
        except NoResultFound:
            return dumps({
                "message": "relationship specified is not found",
            }), 400
        
        return dumps({
            "message": "success",
            "traffic": {
                "port_from": port_from,
                "port_to": port_to,
                "proportion": traffic_info.proportion,
            },
        })
