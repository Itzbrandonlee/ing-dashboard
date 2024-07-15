from flask import Blueprint, request, jsonify
from order import Order

order_bp = Blueprint('order_bp', __name__)

@order_bp.route('/orders', methods=['GET'])
def get_orders():
    orders = Order.get_all_orders()
    return jsonify([order.to_dict() for order in orders])

@order_bp.route('/orders/<int:order_id>', methods=['GET'])
def get_order_by_id(order_id):
    order = Order.get_order_by_id(order_id)
    return jsonify(order.to_dict())

@order_bp.route('/order', methods=['POST'])
def add_order():
    new_order = request.get_json()
    address = new_order['address']
    num_of_windows = new_order['num_of_windows']
    num_of_doors = new_order['num_of_doors']
    notes = new_order['notes']
    total_cost = new_order['total_cost']
    cost_paid = new_order['cost_paid']
    appt_id = new_order['appt_id']
    client_id = new_order['client_id']
    order = Order.add_order(address, num_of_windows, num_of_doors, notes, total_cost, cost_paid, appt_id, client_id)
    return jsonify(order.to_dict()), 201

@order_bp.route('/order/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    result = Order.delete_order(order_id)
    return jsonify(result)

@order_bp.route('/order/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    updated_data = request.get_json()
    address = updated_data.get('address')
    num_of_windows = updated_data.get('num_of_windows')
    num_of_doors = updated_data.get('num_of_doors')
    notes = updated_data.get('notes')
    total_cost = updated_data.get('total_cost')
    cost_paid = updated_data.get('cost_paid')
    client_id = updated_data.get('client_id')
    appt_id = updated_data.get('appt_id')
    order = Order.update_order(order_id, address, num_of_windows, num_of_doors, notes, total_cost, cost_paid, appt_id, client_id)
    return jsonify(order.to_dict())