from flask import Flask, request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
import config

app = Flask(__name__)

def get_db_connection():
    conn = psycopg2.connect(
                host=config.DB_HOST,
        database=config.DB_NAME,
        user=config.DB_USER,
        password=config.DB_PASS,
        cursor_factory=RealDictCursor
    )
    return conn

@app.route('/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM users;')
    users = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(users)

@app.route('/user', methods=['POST'])
def add_user():
    new_user = request.get_json()
    name = new_user['name']
    password = new_user['password']

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO users (name, password) VALUES (%s, %s) RETURNING id;', (name, password))
    new_id = cur.fetchone()['id']
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'id': new_id, 'name': name, 'password': password}), 201
if __name__ == '__main__':
    app.run(debug=True)
