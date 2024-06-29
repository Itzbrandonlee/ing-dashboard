from flask import Flask
from routes.user_routes import user_bp
from routes.client_routes import client_bp
app = Flask(__name__)

app.register_blueprint(user_bp)
app.register_blueprint(client_bp)

if __name__ == '__main__':
    app.run(debug=True)
