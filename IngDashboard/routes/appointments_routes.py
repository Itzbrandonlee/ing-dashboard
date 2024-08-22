from flask import Blueprint, request, jsonify
from appointments import Appointments
from order import Order

appt_bp = Blueprint('appt_bp', __name__)

@appt_bp.route('/appts', methods=['GET'])
def get_appointments():
    appts = Appointments.get_all_appts()
    return jsonify([appt.to_dict() for appt in appts])

@appt_bp.route('/appt', methods=['POST'])
def add_appointment():
    data = request.json
    appt_date = data['appt_date']
    appt_time = data['appt_time']
    client_id = data['client_id']
    order_id = data['order_id']
    paid = data['paid']

    appt = Appointments.add_appt(appt_date, appt_time, paid, client_id, order_id)

    # Update the order with the new appointment ID
    Order.update_order(order_id, appt_id=appt.appt_id)

    return jsonify(appt.to_dict())

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

@appt_bp.route('/appt/<string:appt_date>', methods=['GET'])
def get_appt_by_date(appt_date):
    appts = Appointments.get_appt_by_date(appt_date)
    return jsonify([appt.to_dict() for appt in appts])

@appt_bp.route('/appt/<int:appt_id>', methods=['DELETE'])
def delete_appt(appt_id):
    result = Appointments.delete_appt(appt_id)
    return jsonify(result)