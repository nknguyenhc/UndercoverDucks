from flask import Blueprint

users = Blueprint('simple_page', __name__)

@users.route('/page')
def show():
    return "<h2>quack</h2>"
