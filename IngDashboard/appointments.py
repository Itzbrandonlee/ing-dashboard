from database import Database
from datetime import datetime
from order import Order
class Appointments(Database):
    def __init__(self, appt_id=None, appt_date=None, appt_time=None, paid=None, client_id=None, order_id=None, name=None):
        self.appt_id = appt_id
        self.appt_date = appt_date
        self.appt_time = appt_time
        self.paid = paid
        self.client_id = client_id
        self.order_id = order_id
        self.name = name

    @classmethod
    def get_all_appts(cls):
        conn = cls.get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT a.appt_id, a.appt_date, a.appt_time, a.paid, a.client_id, a.order_id, c.name FROM appointments a JOIN client c ON a.client_id = c.id;')
        appts = cur.fetchall()
        cur.close()
        conn.close()
        return [cls(**appt) for appt in appts]

    @classmethod
    def add_appt(cls, appt_date, appt_time, paid, client_id, order_id):
        appt_date = datetime.strptime(appt_date, '%Y-%m-%d')
        appt_time = datetime.strptime(appt_time, '%H:%M').time()
        conn = cls.get_db_connection()
        cur = conn.cursor()
        cur.execute('INSERT INTO appointments (appt_date, appt_time, paid, client_id, order_id) VALUES (%s, %s, %s, %s, %s) RETURNING appt_id', (appt_date, appt_time, paid, client_id, order_id))
        new_id = cur.fetchone()['appt_id']
        cur.execute("UPDATE orders SET appt_id = %s WHERE order_id = %s", (new_id, order_id))
        conn.commit()
        cur.close()
        conn.close()
        return cls(appt_id=new_id, appt_date=appt_date, appt_time=appt_time, paid=paid, client_id=client_id, order_id=order_id)

    @classmethod
    def update_appt(cls, appt_id, appt_date=None, appt_time=None, paid=None, client_id=None, order_id=None):
        conn = cls.get_db_connection()
        cur = conn.cursor()
        if appt_date:
            cur.execute('UPDATE appointments SET appt_date = %s WHERE appt_id = %s', (appt_date, appt_id))
        if appt_time:
            cur.execute('UPDATE appointments SET appt_time = %s WHERE appt_id = %s', (appt_time, appt_id))
        if paid is not None:
            cur.execute('UPDATE appointments SET paid = %s WHERE appt_id = %s', (paid, appt_id))
        if client_id:
            cur.execute('UPDATE appointments SET client_id = %s WHERE appt_id = %s', (client_id, appt_id))
        if order_id:
            cur.execute('UPDATE appointments SET order_id = %s WHERE appt_id = %s', (order_id, appt_id))
        conn.commit()
        cur.close()
        conn.close()
        return cls.get_appt_by_id(appt_id)

    @classmethod
    def delete_appt(cls, appt_id):
        conn=cls.get_db_connection()
        cur = conn.cursor()
        cur.execute('DELETE from appointments WHERE appt_id = %s', (appt_id,))
        conn.commit()
        cur.close()
        conn.close()
        return {'message': 'Appointment Deleted'}

    @classmethod
    def get_appt_by_id(cls, appt_id):
        conn = cls.get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM appointments WHERE appt_id = %s', (appt_id,))
        appt = cur.fetchone()
        cur.close()
        conn.close()
        if appt:
            return cls(**appt)
        return None

    def to_dict(self):
        return {'appt_id': self.appt_id, 'appt_date': self.appt_date.isoformat(), 'appt_time': self.appt_time.strftime('%H:%M:%S') if self.appt_time else None, 'paid': self.paid, 'client_id': self.client_id, 'order_id': self.order_id, 'name': self.name}