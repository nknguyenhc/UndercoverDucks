from flask import Flask
from flask_login import LoginManager
from dotenv import load_dotenv
import os
from os.path import join, dirname

from routes.users.views import users_bp
from routes.users.models import User
from routes.traffic import traffic


dotenv_path = join(dirname(__file__), '.env')
print(dotenv_path)
load_dotenv(dotenv_path)

app = Flask(__name__)
app.secret_key = b'6G"8#g4]d90/Ko9uJI#H4eDjo]'
app.register_blueprint(users_bp, url_prefix = "/user")
app.register_blueprint(traffic, url_prefix="/traffic")

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "users.index"

@login_manager.user_loader
def load_user(user_id):
    return User(user_id)

if __name__ == '__main__':
    app.run(host=os.environ.get("HOST"), port=os.environ.get("PORT"), debug=os.environ.get("DEBUG") == "True")