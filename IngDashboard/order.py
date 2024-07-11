from database import Database

class Order(Database):
    def __init__(self, order_id=None, address=None, num_of_windows=None, num_of_doors=None, notes=None, total_cost=None, cost_paid=None, rem_balance=None, appt_id=None, client_id=None, name=None):
        self.order_id = order_id
        self.address = address
        self.num_of_windows = num_of_windows
        self.num_of_doors = num_of_doors
        self.notes = notes
        self.total_cost = total_cost
        self.cost_paid = cost_paid
        self.rem_balance = rem_balance
        self.appt_id = appt_id
        self.client_id = client_id
        self.name = name

    @classmethod
    def get_all_orders(cls):
        conn = cls.get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT o.order_id, o.address, o.num_of_windows, o.num_of_doors, o.notes, o.total_cost, o.cost_paid, o.rem_balance, o.appt_id, o.client_id, c.name FROM orders o JOIN client c ON o.client_id = c.id;')
        orders = cur.fetchall()
        cur.close()
        conn.close()
        return [cls(**order) for order in orders]

    @classmethod
    def add_order(cls, address, num_of_windows, num_of_doors, notes, total_cost, cost_paid, appt_id, client_id):
        conn = cls.get_db_connection()
        cur = conn.cursor()
        cur.execute('INSERT INTO orders (address, num_of_windows, num_of_doors, notes, total_cost, cost_paid, appt_id, client_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) returning order_id', (address, num_of_windows, num_of_doors, notes, total_cost, cost_paid, appt_id, client_id))
        new_id = cur.fetchone()['order_id']
        conn.commit()
        cur.close()
        conn.close()
        return cls(order_id=new_id, address=address, num_of_windows=num_of_windows, num_of_doors=num_of_doors, notes=notes, total_cost=total_cost, cost_paid=cost_paid, appt_id=appt_id, client_id=client_id)

    @classmethod
    def delete_order(cls, order_id):
        conn = cls.get_db_connection()
        cur = conn.cursor()
        cur.execute('DELETE from orders WHERE order_id = %s', (order_id, ))
        conn.commit()
        cur.close()
        conn.close()
        return {'message': 'Order Deleted'}

    @classmethod
    def update_order(cls, order_id, address=None, num_of_windows=None, num_of_doors=None, notes=None, total_cost=None, cost_paid=None, appt_id=None, client_id=None):
        conn = cls.get_db_connection()
        cur = conn.cursor()
        if address:
            cur.execute('UPDATE orders SET address = %s WHERE order_id_id = %s', (address, order_id))
        if num_of_windows:
            cur.execute('UPDATE order SET num_of_windows = %s WHERE order_id = %s', (num_of_windows, order_id))
        if num_of_doors:
            cur.execute('UPDATE orders SET num_of_doors = %s WHERE order_id = %s', (num_of_doors, order_id))
        if notes:
            cur.execute('UPDATE orders SET notes = %s WHERE order_id = %s', (notes, order_id))
        if total_cost:
            cur.execute('UPDATE orders SET total_cost = %s WHERE order_id = %s', (total_cost, order_id))
        if cost_paid:
            cur.execute('UPDATE orders SET cost_paid = %s WHERE order_id = %s', (cost_paid, order_id))
        if appt_id:
            cur.execute('UPDATE orders SET appt_id = %s WHERE order_id = %s', (appt_id, order_id))
        if client_id:
            cur.execute('UPDATE orders SET client_id = %s WHERE order_id = %s', (client_id, order_id))
        conn.commit()
        cur.close()
        conn.close()
        return cls.get_order_by_id(order_id)

    @classmethod
    def get_order_by_id(cls, order_id):
        conn = cls.get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT o.order_id, o.address, o.num_of_windows, o.num_of_doors, o.notes, o.total_cost, o.cost_paid, o.rem_balance, o.appt_id, o.client_id, c.name FROM orders o JOIN client c ON o.client_id = c.id WHERE order_id = %s', (order_id,))
        order = cur.fetchone()
        cur.close()
        conn.close()
        if order:
            return cls(**order)
        return None

    def to_dict(self):
        return {'order_id': self.order_id, 'address': self.address, 'num_of_windows': self.num_of_windows, 'num_of_doors': self.num_of_doors, 'notes': self.notes, 'total_cost': self.total_cost, 'cost_paid': self.cost_paid, 'rem_balance': self.rem_balance, 'appt_id': self.appt_id, 'client_id': self.client_id, 'name':self.name}