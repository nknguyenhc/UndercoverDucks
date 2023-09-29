from flask import Blueprint, flash, redirect, render_template, url_for
from flask_login import (
    login_user,
    logout_user,
    login_required,
)
from webargs import fields
from webargs.flaskparser import use_args
from sqlalchemy import select
from sqlalchemy.orm import Session
from db.users import UserAuth
from migrations import engine

from .models import User
from db import users

users_bp = Blueprint('users', __name__)

@users_bp.route('/')
def index():
    return "<h2>quack</h2>"

@users_bp.route('/login', methods=["GET"])
@use_args({
    "username": fields.Str(required=True),
    "password": fields.Str(required=True),
}, location="query")
def login(args):
    username = args["username"]
    password = args["password"]
    if auth_user(username, password):
        user = User(username)
        login_user(user)
        flash("Logged in successfully")
        return "<h2>Welcome, {}!<h2>".format(username)
    return "nope"

@users_bp.route('/logout', methods=["GET"])
@login_required
def logout():
    logout_user()
    return redirect(url_for("users.index"))

def auth_user(username: str, password: str) -> bool:
    with Session(engine) as session:
        stmt = select(UserAuth).where(UserAuth.username == username)
        user_auth = session.scalars(stmt).one()
        password_hash = user_auth.password_hash
        return User.check_password(password_hash=password_hash, password=password)

