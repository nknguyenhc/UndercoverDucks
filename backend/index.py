from flask import Flask
from routes.users import users
from routes.traffic import traffic
from dotenv import load_dotenv
import os
from os.path import join, dirname

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

app = Flask(__name__)

app.register_blueprint(users)
app.register_blueprint(traffic, url_prefix="/traffic")

if __name__ == '__main__':
    app.run(host=os.environ.get("HOST"), port=os.environ.get("PORT"), debug=os.environ.get("DEBUG") == "True")