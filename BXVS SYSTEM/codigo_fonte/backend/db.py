from flask import Flask
from flask_mysqldb import MySQL
import os

app = Flask(__name__, 
    template_folder=os.path.join(os.path.dirname(__file__), "..", "frontend", "templates"),
    static_folder=os.path.join(os.path.dirname(__file__), "..", "frontend", "static"))

app.config["MYSQL_HOST"] = "localhost"
app.config["MYSQL_USER"] = "root"
app.config["MYSQL_PASSWORD"] = "Jv,40028922"
app.config["MYSQL_DB"] = "academia"

mysql = MySQL(app)