from flask import Flask
from flask_cors import CORS
from routes import routes
import os

app = Flask(__name__)
CORS(app)

# Registra rotas
app.register_blueprint(routes)