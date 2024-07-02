from flask import Blueprint, request, jsonify
from client import Client


client_bp = Blueprint('client_bp', __name__)

@client_bp.route('/clients', methods=['GET'])
def get_clients():
    clients = Client.get_all_clients()
    return jsonify([client.to_dict() for client in clients])

@client_bp.route('/client', methods=['POST'])
def add_client():
    new_client = request.get_json()
    name = new_client['name']
    email = new_client['email']
    phone_number = new_client['phone_number']
    client = Client.add_client(name, email, phone_number)
    return jsonify(client.to_dict()), 201

@client_bp.route('/client/<int:client_id>', methods=['PUT'])
def update_client(client_id):
    updated_data = request.get_json()
    name = updated_data.get('name')
    email = updated_data.get('email')
    phone_number = updated_data.get('phone_number')
    client = Client.update_client(client_id, name, email, phone_number)
    return jsonify(client.to_dict())

@client_bp.route('/client/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):
    result = Client.delete_client(client_id)
    return jsonify(result)