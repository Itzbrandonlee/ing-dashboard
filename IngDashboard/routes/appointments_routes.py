from flask import Blueprint, request, jsonify
from appointments import Appointments

appt_bp = Blueprint('appt_bp', __name__)

@appt_bp.route('/appts', methods=['GET'])
def get_appointments():
    appts = Appointments.get_all_appts()
    return jsonify([appt.to_dict() for appt in appts])

@appt_bp.route('/appt', methods=['POST'])
def add_appt():
    new_appt = request.get_json()
    appt_date = new_appt['appt_date']
    appt_time = new_appt['appt_time']
    paid = new_appt['paid']
    client_id = new_appt['client_id']
    order_id = new_appt['order_id']
    appt = Appointments.add_appt(appt_date, appt_time, paid, client_id, order_id)
    return jsonify(appt.to_dict()), 201

@appt_bp.route('/appt/<int:appt_id>', methods=['PUT'])
def update_appt(appt_id):
    updated_data = request.get_json()
    appt_date = updated_data.get('appt_date')
    appt_time = updated_data.get('appt_time')
    paid = updated_data.get('paid')
    client_id = updated_data.get('client_id')
    order_id = updated_data.get('order_id')
    appt = Appointments.update_appt(appt_id, appt_date, appt_time, paid, client_id, order_id)
    return jsonify(appt.to_dict())

@appt_bp.route('/appt/<int:appt_id>', methods=['DELETE'])
def delete_appt(appt_id):
    result = Appointments.delete_appt(appt_id)
    return jsonify(result)