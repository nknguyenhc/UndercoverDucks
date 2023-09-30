from flask import Blueprint, redirect, render_template, request, url_for
from flask_login import (
    login_user,
    logout_user,
    login_required,
    current_user,
)
from webargs import fields, ValidationError
from webargs.flaskparser import use_args
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from sqlalchemy.orm import Session
from db.users import UserAuth
from migrations import engine
from json import dumps

from .models import User
from db import users

users_bp = Blueprint('users', __name__)

@users_bp.route('/')
def index():
    return "<h2>quack</h2>"

@users_bp.route('/login', methods=["POST"])
def login():
    payload = request.json
    username = payload.get("username")
    password = payload.get("password")

    if type(username) != str:
        return dumps({
            "message": "no username provided / invalid username",
        }), 400
    if type(password) != str:
        return dumps({
            "message": "no password provided / invalid password",
        }), 400

    try: 
        if auth_user(username, password):
            user = User(username)
            login_user(user)
            return dumps({
                "message": "success",
            })
        return dumps({
            "message": "wrong username or password",
        })
    except NoResultFound:
        return dumps({
            "message": "wrong username or password",
        })

@users_bp.route('/logout', methods=["GET"])
@login_required
def logout():
    logout_user()
    return redirect(url_for("users.index"))

@users_bp.route('/status', methods=['GET'])
def is_logged_in():
    info = {
        "status": current_user.is_authenticated
    }
    if current_user.is_authenticated:
        info.update({
            "username": current_user.username,
        })
    print(info)
    return dumps(info)

def auth_user(username: str, password: str) -> bool:
    with Session(engine) as session:
        stmt = select(UserAuth).where(UserAuth.username == username)
        user_auth = session.scalars(stmt).one()
        password_hash = user_auth.password_hash
        return User.check_password(password_hash=password_hash, password=password)

