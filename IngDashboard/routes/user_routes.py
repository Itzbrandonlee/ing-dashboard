from flask import Blueprint, request, jsonify
from user import User

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.get_all_users()
    return jsonify([user.to_dict() for user in users])

@user_bp.route('/user', methods=['POST'])
def add_user():
    new_user = request.get_json()
    name = new_user['name']
    password = new_user['password']
    user = User.add_user(name, password)
    return jsonify(user.to_dict()), 201
