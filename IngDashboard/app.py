from flask import Flask
from routes.user_routes import user_bp
from routes.client_routes import client_bp
from routes.appointments_routes import appt_bp
from routes.order_routes import order_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.register_blueprint(user_bp)
app.register_blueprint(client_bp)
app.register_blueprint(appt_bp)
app.register_blueprint(order_bp)

if __name__ == '__main__':
    app.run(debug=True)
