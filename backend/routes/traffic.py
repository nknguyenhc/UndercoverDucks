from flask import Blueprint, request
from flask_login import login_required
from json import dumps
from sqlalchemy import select, update
from sqlalchemy.exc import NoResultFound
from sqlalchemy.orm import Session
from db.traffic import Port, Traffic, Similarity
#from markov.markov import get_ship_proportions_over_time, get_new_change
from migrations import engine

traffic = Blueprint('traffic', __name__)

def get_port(port_id):
    with Session(engine) as session:
        stmt = select(Port).where(Port.id == port_id)
        port = session.scalars(stmt).one()
        return {
            "id": port.id,
            "name": port.name,
            "country_code": port.country_code,
            "volume": port.volume,
        }

@traffic.route('/', methods=['GET'])
@login_required
def get_all():
    with Session(engine) as session:
        portStmt = select(Port)
        ports = list(map(
            lambda port: {
                "id": port.id,
                "name": port.name,
                "country_code": port.country_code,
                "volume": port.volume,
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
        for traffic in traffics:
            from_id = traffic["port_from_id"]
            to_id = traffic["port_to_id"]
            stmt = select(Similarity).where((Similarity.port_from_id == from_id) & (Similarity.port_to_id == to_id))
            similarity = session.scalars(stmt).one()
            similarity = {
                "id": similarity.id,
                "port_from_id": similarity.port_from_id,
                "port_to_id": similarity.port_to_id,
                "value": similarity.value
            }
            traffic.setdefault("similarity", similarity)
        return dumps({
            "message": "success",
            "ports": ports,
            "traffics": traffics,
        })

@traffic.route('/volume', methods=['GET'])
@login_required
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
@login_required
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
@login_required
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
@login_required
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
    
@traffic.route('/set-country-code', methods=['POST'])
@login_required
def set_country_code():
    payload = request.json
    port_id = payload.get("port_id")
    new_country_code = payload.get("new_country_code")

    try:
        port_id = int(port_id)
    except (ValueError, TypeError):
        return dumps({
            "message": "invalid port_id provided",
        }), 400
    
    if type(new_country_code) != str:
        return dumps({
            "message": "invalid new_country_code provided", 
        }), 400
    
    with Session(engine) as session:
        session.query(Port) \
            .filter(Port.id == port_id) \
            .update({
                "country_code": new_country_code
            })
        session.commit()
        return dumps({
            "message": "success",
        })

@traffic.route('/set-proportion-row', methods = ['POST'])
@login_required
def set_proportion_row():
    payload = request.json
    from_port_id = payload.get("from_port_id")
    to_port_list = payload.get("to_port_list")
    length = len(to_port_list)

    try:
        from_port_id = int(from_port_id)
        to_list = []
        sum = 0
        for port in to_port_list:
            to_port_id = int(port["to_port_id"])
            proportion = float(port["proportion"])
            if proportion < 0 or proportion > 1:
                return dumps({
                    "message": "proportion not within valid range"
                }), 400
            sum += proportion
            to_list.append({
                "to_port_id": to_port_id,
                "proportion": proportion
            })
        if sum != 1:
            return dumps({
                "message": "proportions do not add up to 1"
            }), 400
        with Session(engine) as session:
            if length != session.query(Port).count():
                return dumps({
                    "message": "invalid length of to_port_list",
                }), 400
            for port in to_list:
                to_port_id = int(port["to_port_id"])
                session.query(Traffic) \
                       .filter((Traffic.port_from_id == from_port_id) & (Traffic.port_to_id == to_port_id)) \
                       .update({"proportion": port["proportion"]})
            session.commit()
        return dumps({
            "message": "success",
        })
    
    except (ValueError, TypeError):
        return dumps({
            "message": "invalid port id or proportion provided"
        }), 400


@traffic.route('/set-proportion', methods=['POST'])
@login_required
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
@login_required
def add_port():
    payload = request.json
    name = payload.get("name")
    country_code = payload.get("country_code")
    volume = payload.get("volume")

    if type(name) != str:
        return dumps({
            "message": "invalid name provided",
        }), 400
    if type(country_code) != str:
        return dumps({
            "message": "invalid country code provided",
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
            country_code = country_code,
            traffics_from=[],
            traffics_to=[],
            volume=volume,
        )
        session.add(port)
        session.flush()
        session.refresh(port)
        new_port_id = port.id
        portStmt = select(Port)
        for port in session.scalars(portStmt):
            if port.id == new_port_id:
                traffic = Traffic(
                    port_from_id=new_port_id,
                    port_to_id=new_port_id,
                    proportion=1,
                )
                similarity = Similarity(
                    port_from_id=new_port_id,
                    port_to_id=new_port_id,
                    value=0
                )
                session.add(traffic)
                session.add(similarity)
            else:
                traffic1 = Traffic(
                    port_from_id=new_port_id,
                    port_to_id=port.id,
                    proportion=0,
                )
                traffic2 = Traffic(
                    port_from_id=port.id,
                    port_to_id=new_port_id,
                    proportion=0,
                )
                similarity1 = Similarity(
                    port_from_id=new_port_id,
                    port_to_id=port.id,
                    value=0
                )
                similarity2 = Similarity(
                    port_from_id=port.id,
                    port_to_id=new_port_id,
                    value=0
                )
                session.add(traffic1)
                session.add(traffic2)
                session.add(similarity1)
                session.add(similarity2)
        session.commit()
        return dumps({
            "message": "success",
        })

@traffic.route('/close-port', methods=['POST'])
@login_required
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
