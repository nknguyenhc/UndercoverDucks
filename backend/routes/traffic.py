from flask import Blueprint, request
from json import dumps
from sqlalchemy import select, update
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
            "is_open": port.is_open,
        }

@traffic.route('/', methods=['GET'])
def get_all():
    with Session(engine) as session:
        portStmt = select(Port)
        ports = list(map(
            lambda port: {
                "id": port.id,
                "name": port.name,
                "volume": port.volume,
                "is_open": port.is_open,
            },
            session.scalars(portStmt)
        ))
        trafficStmt = select(Traffic)
        traffics = list(map(
            lambda traffic: {
                "id": traffic.id,
                "port_from_id": traffic.port_from_id,
                "port_to_id": traffic.port_to_id,
                "proportion": traffic.proportion,
            },
            session.scalars(trafficStmt)
        ))
        return dumps({
            "message": "success",
            "ports": ports,
            "traffics": traffics,
        })

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

@traffic.route('/set-volume', methods=['POST'])
def set_volume():
    payload = request.json
    port_id = payload.get("port_id")
    new_volume = payload.get("new_volume")
    
    try:
        port_id = int(port_id)
    except (ValueError, TypeError):
        return dumps({
            "message": "invalid port_id provided",
        }), 400
    
    try:
        new_volume = int(new_volume)
    except (ValueError, TypeError):
        return dumps({
            "message": "invalid new_volume provided",
        }), 400
    
    with Session(engine) as session:
        session.query(Port) \
            .filter(Port.id == port_id) \
            .update({
                "volume": new_volume
            })
        session.commit()
        return dumps({
            "message": "success",
        })

@traffic.route('/set-name', methods=['POST'])
def set_name():
    payload = request.json
    port_id = payload.get("port_id")
    new_name = payload.get("new_name")

    try:
        port_id = int(port_id)
    except (ValueError, TypeError):
        return dumps({
            "message": "invalid port_id provided",
        }), 400
    
    if type(new_name) != str:
        return dumps({
            "message": "invalid new_name provided", 
        }), 400
    
    with Session(engine) as session:
        session.query(Port) \
            .filter(Port.id == port_id) \
            .update({
                "name": new_name
            })
        session.commit()
        return dumps({
            "message": "success",
        })

@traffic.route('/set-proportion', methods=['POST'])
def set_proportion():
    payload = request.json
    port_from_id = payload.get("port_from_id")
    port_to_id = payload.get("port_to_id")
    new_proportion = payload.get("new_proportion")

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
        new_proportion = float(new_proportion)
    except (ValueError, TypeError):
        return dumps({
            "message": "invalid new_proportion provided",
        }), 400
    if new_proportion < 0 or new_proportion > 1:
        return dumps({
            "message": "new_proportion not within range",
        }), 400
    
    with Session(engine) as session:
        session.query(Traffic) \
            .filter(Traffic.port_from_id == port_from_id, Traffic.port_to_id == port_to_id) \
            .update({
                "proportion": new_proportion,
            })
        session.commit()
        return dumps({
            "message": "success",
        })

@traffic.route('/add-port', methods=['POST'])
def add_port():
    payload = request.json
    name = payload.get("name")
    volume = payload.get("volume")

    if type(name) != str:
        return dumps({
            "message": "invalid name provided",
        }), 400
    try:
        volume = int(volume)
    except (ValueError, TypeError):
        return dumps({
            "message": "invalid volume provided",
        }), 400
    
    with Session(engine) as session:
        port = Port(
            name=name,
            traffics_from=[],
            traffics_to=[],
            volume=volume,
        )
        session.add(port)
        session.commit()
        return dumps({
            "message": "success",
        })

@traffic.route('/add-connection', methods=['POST'])
def add_connection():
    payload = request.json
    port_from_id = payload.get("port_from_id")
    port_to_id = payload.get("port_to_id")
    proportion = payload.get("proportion")

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
        proportion = float(proportion)
    except (ValueError, TypeError):
        return dumps({
            "message": "invalid proportion provided",
        }), 400
    
    with Session(engine) as session:
        traffic = Traffic(
            port_from_id=port_from_id,
            port_to_id=port_to_id,
            proportion=proportion,
        )
        session.add(traffic)
        session.commit()
        return dumps({
            "message": "success",
        })

@traffic.route('/close-port', methods=['POST'])
def close_port():
    payload = request.json
    port_id = payload.get("port_id")

    try:
        port_id = int(port_id)
    except (ValueError, TypeError):
        return dumps({
            "message": "invalid port_id provided",
        }), 400
    
    with Session(engine) as session:
        session.query(Port) \
            .filter(Port.id == port_id) \
            .update({
                "is_open": False,
            })
        session.commit()
        return dumps({
            "message": "success"
        })
